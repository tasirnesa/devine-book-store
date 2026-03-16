/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bam: {
                    navy: '#003366',
                    red: '#e31837',
                    light: '#f3f3f3',
                    dark: '#111111',
                },
                spiritual: {
                    light: '#f8fafc',
                    dark: '#0f172a',
                    accent: '#6366f1',
                },
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
