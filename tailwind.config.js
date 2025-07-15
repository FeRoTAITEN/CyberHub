/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // الخطوط الأساسية
        sans: ['var(--font-inter)', 'Inter', 'Arial', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
        
        // خطوط متخصصة
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        jetbrains: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
        cairo: ['var(--font-cairo)', 'Cairo', 'sans-serif'],
        'noto-arabic': ['var(--font-noto-arabic)', 'Noto Sans Arabic', 'sans-serif'],
        
        // خطوط للعناوين
        display: ['var(--font-inter)', 'Inter', 'sans-serif'],
        tech: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
    },
  },
  plugins: [],
} 