import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },

    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'blob': 'blob 20s infinite',
        'pulse-slow': 'pulse 6s infinite',
        'float': 'float 6s ease-in-out infinite',
        'shine': 'shine 8s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'wave': 'wave 8s ease-in-out infinite',
        'scale-pulse': 'scale-pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce-slow 6s infinite',
        'accordion-down': 'accordion-down 0.2s ease-in-out',
        'accordion-up': 'accordion-up 0.2s ease-in-out',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'blob': {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
            opacity: '0.7',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.2)',
            opacity: '0.5',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
            opacity: '0.3',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
            opacity: '0.7',
          },
        },
        'float': {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)' 
          },
          '25%': { 
            transform: 'translateY(-10px) rotate(1deg)' 
          },
          '50%': { 
            transform: 'translateY(5px) rotate(-1deg)' 
          },
          '75%': { 
            transform: 'translateY(-5px) rotate(0.5deg)' 
          },
        },
        'shine': {
          '0%': { 
            backgroundPosition: '200% 0' 
          },
          '100%': { 
            backgroundPosition: '-200% 0' 
          },
        },
        'shimmer': {
          '100%': {
            transform: 'translateX(100%)'
          }
        },
        'wave': {
          '0%, 100%': { 
            transform: 'translateY(0) scale(1)' 
          },
          '25%': { 
            transform: 'translateY(-15px) scale(1.05)' 
          },
          '50%': { 
            transform: 'translateY(5px) scale(0.95)' 
          },
          '75%': { 
            transform: 'translateY(-5px) scale(1.02)' 
          },
        },
        'scale-pulse': {
          '0%, 100%': { 
            transform: 'scale(1)' 
          },
          '50%': { 
            transform: 'scale(1.05)' 
          }
        },
        'bounce-slow': {
          '0%, 100%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(-15px)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      backgroundColor: {
        'selected-btn-bg': 'rgba(80,80,80,0.3)',
      },
      boxShadow: {
        'form-shadow': '0px 0px 10px 4px rgba(255,255,255,0.5)',
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.5)',
        'glow-white': '0 0 10px rgba(255, 255, 255, 0.5)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      perspective: {
        '800': '800px',
        '1000': '1000px',
        '1200': '1200px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.perspective-800': {
          perspective: '800px',
        },
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.perspective-1200': {
          perspective: '1200px',
        },
        '.transform-style-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
      }
      addUtilities(newUtilities)
    })
  ],
}

export default config
