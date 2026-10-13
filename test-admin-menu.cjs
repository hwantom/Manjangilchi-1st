const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { createHandler, validateItems } = require('./netlify/functions/admin-menu');
const { privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const env = {
    ADMIN_ACCESS_TOKEN: 'test-only-admin-token-with-at-least-32-characters',
    SHEET_ID: 'test-sheet', SHEET_TAB: '시트1', GEMINI_API_KEY: 'test-only',
    GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: 'test@example.invalid', private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }) })
};
function setup() {
    const state = { header: ['name','메뉴','가격','slug'], names: [['자미당']], menu: [['기존 메뉴']], price: [['1,000원']], slug: [['jamidang']], writes: [], calls: [], ocr: { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ detectedStore: '자미당', warnings: [], items: [{ name:'꽈배기 3개',price:'2,500원',needsReview:false,note:'' }] }) }] } }] } };
    const request = async (url, options = {}) => {
        state.calls.push({ url, options });
        let result;
        if (url.includes('oauth2.googleapis.com')) result = { access_token: 'fake-google-token' };
        else if (url.includes('generativelanguage.googleapis.com')) result = state.ocr;
        else if (url.includes('/values:batchUpdate')) {
            const body = JSON.parse(options.body); state.writes.push(body);
            result = { responses: body.data.map(x => ({ updatedData: { values: x.values } })) };
            if (state.badReadback) result.responses[0].updatedData.values = [['unexpected']];
        } else if (url.includes('/values:batchGet')) {
            const ranges = new URL(url).searchParams.getAll('ranges');
            const names = { name: 'names', '메뉴':'menu', '가격':'price', slug:'slug' };
            result = { valueRanges: ranges.map(range => {
                const index = range.match(/!([A-Z]+)/)[1].charCodeAt(0) - 65;
                return { values: state[names[state.header[index]]] || [] };
            }) };
        } else if (url.includes('/values/')) result = { values: [state.header] };
        else result = { properties: { title: 'Test sheet' }, sheets: [{ properties: { title: '시트1', sheetId: 0, gridProperties: { rowCount:1000, columnCount:30 } } }] };
        return { ok: true, json: async () => result };
    };
    const handler = createHandler({ env, request });
    const call = async (body, overrides = {}) => {
        const response = await handler({ httpMethod:'POST', headers: { authorization: 'Bearer ' + env.ADMIN_ACCESS_TOKEN }, body: JSON.stringify(body), ...overrides });
        return { ...response, data: JSON.parse(response.body) };
    };
    const draft = async () => {
        const list = await call({ action: 'list' }); assert.equal(list.statusCode, 200);
        const store = list.data.stores[0];
        return { action: 'save', store: { name:store.name, slug:store.slug }, version:store.version, reviewed:true, items: [{ name:'꽈배기 3개', price:'2,500원' }, { name:'찹쌀도너츠',price:'2,000원' }] };
    };
    return { state, call, draft };
}
test('all API actions require the admin secret before external calls', async () => {
    const { state, call } = setup();
    for (const action of ['list','extract','save']) assert.equal((await call({action}, {headers:{}})).statusCode,401);
    assert.equal(state.calls.length,0);
});
test('missing admin setup fails closed', async () => {
    const handler = createHandler({ env:{},request:()=>assert.fail('external call') });
    assert.equal((await handler({httpMethod:'POST'})).statusCode,503);
});
test('four-digit access codes preserve leading zeroes and require an exact match', async () => {
    const handler = createHandler({env:{ADMIN_ACCESS_TOKEN:'0105'},request:()=>assert.fail('external call')});
    const call = key => handler({httpMethod:'POST',headers:{authorization:'Bearer '+key},body:JSON.stringify({action:'unknown'})});
    assert.equal((await call('0105')).statusCode,400); // Authenticated; unsupported action.
    for (const key of ['105','0104','','0000']) assert.equal((await call(key)).statusCode,401);
});
test('rejects malformed, oversized, and unreviewed requests', async () => {
    const {call,state} = setup();
    assert.equal((await call({}, {body:'{'})).statusCode,400);
    assert.equal((await call({}, {body:'x'.repeat(4_500_001)})).statusCode,413);
    assert.equal((await call({action:'save', items:[{name:'a',price:'1원'}]})).statusCode,400);
    assert.equal(state.calls.length,0);
});
test('only menu and price cells are written as literal, aligned multiline values', async () => {
    const { state,call,draft } = setup();
    const result = await call(await draft()); assert.equal(result.statusCode,200);
    assert.equal(state.writes.length,1);
    assert.equal(state.writes[0].valueInputOption,'RAW');
    assert.deepEqual(state.writes[0].data,[{range:"'시트1'!B2",values:[['꽈배기 3개\n찹쌀도너츠']]},{range:"'시트1'!C2",values:[['2,500원\n2,000원']]}]);
});
test('column deletion/reordering is handled by headers', async () => {
    const {state,call,draft} = setup(); state.header=['가격','slug','name','메뉴'];
    assert.equal((await call(await draft())).statusCode,200);
    assert.deepEqual(state.writes[0].data.map(x=>x.range),["'시트1'!D2","'시트1'!A2"]);
});
test('changed sheet values are rejected before writing', async () => {
    const {state,call,draft} = setup(); const body=await draft(); state.price=[['8,000원']];
    assert.equal((await call(body)).statusCode,409); assert.equal(state.writes.length,0);
});
test('a moved row or changed column layout cannot overwrite a different cell', async () => {
    const {state,call,draft}=setup();const body=await draft();
    state.names.unshift(['다른 가게']);state.menu.unshift(['국수']);state.price.unshift(['7,000원']);state.slug.unshift(['other']);
    assert.equal((await call(body)).statusCode,409);assert.equal(state.writes.length,0);
});
test('ambiguous stores and duplicate headers are rejected', async () => {
    const {state,call,draft}=setup();const body=await draft();
    state.names.push(['자미당']);state.slug.push(['jamidang']);
    assert.equal((await call(body)).statusCode,409);
    state.header.push('메뉴');assert.equal((await call({action:'list'})).statusCode,409);
    assert.equal(state.writes.length,0);
});
test('missing names/prices and separator ambiguity cannot be saved', () => {
    for (const input of [[],[{name:'국수',price:''}],[{name:'국수\n라면',price:'1원'}],[{name:'국수',price:'1원'},{name:'국 수',price:'2원'}]]) assert.throws(()=>validateItems(input));
    assert.deepEqual(validateItems([{name:'=SUM(A1)',price:'점포 문의'}]),[{name:'=SUM(A1)',price:'점포 문의'}]); // Sheets RAW prevents formula evaluation.
});
test('a mismatched write response is not reported as success', async () => {
    const {state,call,draft}=setup();state.badReadback=true;assert.equal((await call(await draft())).statusCode,502);
});
test('OCR is structured and cannot write the sheet', async () => {
    const {state,call}=setup();const result=await call({action:'extract',image:'data:image/jpeg;base64,YWJj'});
    assert.equal(result.statusCode,200);assert.equal(result.data.items[0].name,'꽈배기 3개');assert.equal(state.writes.length,0);
    const payload=JSON.parse(state.calls[0].options.body);
    assert.equal(payload.generationConfig.responseMimeType,'application/json');
    assert.equal(payload.generationConfig.responseJsonSchema.additionalProperties,false);
    assert.deepEqual(payload.contents[0].parts[1].inlineData,{mimeType:'image/jpeg',data:'YWJj'});
    assert.equal(state.calls[0].options.headers['x-goog-api-key'],env.GEMINI_API_KEY);
    assert.equal(state.calls[0].url,'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent');
    assert.equal(state.calls.length,1);
});
test('Gemini errors distinguish model availability, credentials, quota, and outages without exposing upstream details', async () => {
    for (const [upstream, status, message] of [[404,503,'모델'],[401,503,'API 키'],[403,503,'API 키'],[429,429,'사용량 한도'],[500,503,'지연'],[400,502,'요청이 거절']]) {
        let calls=0;
        const handler=createHandler({env,pause:async()=>{},log:()=>{},request:async url=>{
            calls++;
            assert(url.includes('generativelanguage.googleapis.com'));
            return {ok:false,status:upstream,json:async()=>({error:{message:'secret-upstream-detail'}})};
        }});
        const result=await handler({httpMethod:'POST',headers:{authorization:'Bearer '+env.ADMIN_ACCESS_TOKEN},body:JSON.stringify({action:'extract',image:'data:image/png;base64,YWJj'})});
        assert.equal(result.statusCode,status);assert(JSON.parse(result.body).error.includes(message));assert(!result.body.includes('secret-upstream-detail'));
        assert.equal(calls,[404,500].includes(upstream)?2:1);
    }
});
test('transient Gemini failure switches models once and recovers without a sheet write', async () => {
    let calls=0;
    const handler=createHandler({env,pause:async()=>{},log:()=>{},request:async url=>{
        assert(url.includes('generativelanguage.googleapis.com'));calls++;
        assert(url.includes(calls===1?'gemini-3.1-flash-lite':'gemini-3.5-flash-lite'));
        if(calls===1)return {ok:false,status:503,json:async()=>({})};
        return {ok:true,status:200,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({detectedStore:'',warnings:[],items:[]})}]}}]})};
    }});
    const result=await handler({httpMethod:'POST',headers:{authorization:'Bearer '+env.ADMIN_ACCESS_TOKEN},body:JSON.stringify({action:'extract',image:'data:image/png;base64,YWJj'})});
    assert.equal(result.statusCode,200);assert.equal(calls,2);
});
test('OCR failover handles connection failures and non-JSON server errors', async () => {
    for(const first of ['connection','html']) {
        let calls=0;
        const handler=createHandler({env,pause:async()=>{},log:()=>{},request:async(url,options)=>{
            calls++;assert(options.signal);assert(options.timeout<=29000);
            if(calls===1){
                if(first==='connection')throw Error('private-network-error');
                return {ok:false,status:503,json:async()=>{throw Error('HTML response')}};
            }
            return {ok:true,status:200,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({detectedStore:'',warnings:[],items:[]})}]}}]})};
        }});
        const result=await handler({httpMethod:'POST',headers:{authorization:'Bearer '+env.ADMIN_ACCESS_TOKEN},body:JSON.stringify({action:'extract',image:'data:image/png;base64,YWJj'})});
        assert.equal(result.statusCode,200);assert.equal(calls,2);
    }
});
test('OCR failover stops when the overall deadline has passed', async () => {
    let clock=0,calls=0;
    const handler=createHandler({env,now:()=>clock,pause:async ms=>{clock+=ms},log:()=>{},request:async()=>{
        calls++;clock=54500;return {ok:false,status:503,json:async()=>({})};
    }});
    const result=await handler({httpMethod:'POST',headers:{authorization:'Bearer '+env.ADMIN_ACCESS_TOKEN},body:JSON.stringify({action:'extract',image:'data:image/png;base64,YWJj'})});
    assert.equal(result.statusCode,503);assert.equal(calls,1);
});
test('refused or incomplete OCR never creates menu rows', async () => {
    const {state,call}=setup();state.ocr={candidates:[{finishReason:'MAX_TOKENS'}]};
    assert.equal((await call({action:'extract',image:'data:image/jpeg;base64,YWJj'})).statusCode,422);
    assert.equal((await call({action:'extract',image:'https://example.invalid/image.png'})).statusCode,400);
    assert.equal(state.writes.length,0);
});
test('Gemini blocked, malformed, and null output cannot become editable results', async () => {
    const {state,call}=setup();
    for (const result of [
        {promptFeedback:{blockReason:'SAFETY'}},
        {candidates:[{finishReason:'STOP',content:{parts:[{text:'null'}]}}]},
        {candidates:[{finishReason:'STOP',content:{parts:[{text:'invalid json'}]}}]}
    ]) {
        state.ocr=result;
        assert.equal((await call({action:'extract',image:'data:image/png;base64,YWJj'})).statusCode,422);
    }
    assert.equal(state.writes.length,0);
});
test('Gemini thought parts are excluded from the JSON response', async () => {
    const {state,call}=setup();
    state.ocr.candidates[0].content.parts.unshift({thought:true,text:'internal analysis'});
    assert.equal((await call({action:'extract',image:'data:image/webp;base64,YWJj'})).statusCode,200);
    assert.equal(JSON.parse(state.calls[0].options.body).contents[0].parts[1].inlineData.mimeType,'image/webp');
});
test('OpenAI key alone does not enable Gemini OCR', async () => {
    const handler=createHandler({env:{...env,GEMINI_API_KEY:'',OPENAI_API_KEY:'unused'},request:()=>assert.fail('external call')});
    const result=await handler({httpMethod:'POST',headers:{authorization:'Bearer '+env.ADMIN_ACCESS_TOKEN},body:JSON.stringify({action:'extract',image:'data:image/jpeg;base64,YWJj'})});
    assert.equal(result.statusCode,503);
});
test('config generation never publishes server credentials', () => {
    const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{execFileSync}=require('node:child_process');
    const dir=fs.mkdtempSync(path.join(os.tmpdir(),'menu-config-test-'));
    try {
        execFileSync(process.execPath,[path.join(__dirname,'generate-config.js')],{cwd:dir,env:{...process.env,GEMINI_API_KEY:'private-gemini-test',OPENAI_API_KEY:'private-openai-test',ADMIN_ACCESS_TOKEN:'private-admin-test',GOOGLE_SERVICE_ACCOUNT_JSON:'private-google-test',SHEET_ID:'sheet"\\test'}});
        const text=fs.readFileSync(path.join(dir,'config.js'),'utf8');assert(!text.includes('private-'));new Function(text);
    } finally { fs.unlinkSync(path.join(dir,'config.js'));fs.rmdirSync(dir); }
});
