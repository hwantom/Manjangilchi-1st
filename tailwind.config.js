/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    bg: '#FAFBFC',
                    ink: '#1A1A1B',
                    accent: '#F3F4F6',
                    food: '#F4AFA0',
                    life: '#A8D8C9',
                    snack: '#F6D267',
                    coin: '#FF922B',
                }
            },
            fontFamily: {
                sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
