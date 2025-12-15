import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                border: "var(--border)",
            },
            fontFamily: {
                sans: ["var(--font-body)", "sans-serif"],
                heading: ["var(--font-heading)", "sans-serif"],
            },
            typography: {
                DEFAULT: {
                    css: {
                        color: 'var(--foreground)',
                        a: {
                            color: 'var(--foreground)',
                            '&:hover': {
                                color: '#ffb703',
                            },
                        },
                        h1: { color: 'var(--foreground)' },
                        h2: { color: 'var(--foreground)' },
                        h3: { color: 'var(--foreground)' },
                        h4: { color: 'var(--foreground)' },
                        strong: { color: 'var(--foreground)' },
                        blockquote: { color: '#888', borderLeftColor: '#333' },
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
export default config;
