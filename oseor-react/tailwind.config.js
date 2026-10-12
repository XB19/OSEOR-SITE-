/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Couleurs extraites du logo OSEOR
        brand: {
          blue: '#036eb1',
          'blue-dark': '#02508a',
          'blue-light': '#e8f2fa',
          red: '#ae151e',
          'red-dark': '#8a0f17',
          'red-light': '#fbecee',
          navy: '#0b2a4a',
          ink: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Ubuntu', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(3, 110, 177, 0.18)',
        card: '0 4px 24px -6px rgba(15, 23, 42, 0.08)',
        glow: '0 20px 50px -15px rgba(174, 21, 30, 0.45)',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.12)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        kenburns: 'kenburns 20s ease-out forwards',
        marquee: 'marquee 40s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
