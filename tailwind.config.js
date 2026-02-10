/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#101010', // Sidebar/Header BG
                    light: '#F0F0F3', // Main Content BG
                    primary: '#B7EF02', // Accent/Primary
                }
            },
            fontFamily: {
                serif: ['Federo', 'serif'],
                sans: ['Barlow', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
