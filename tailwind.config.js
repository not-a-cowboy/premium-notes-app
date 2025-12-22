/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-primary)',
        'primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'card-bg': 'var(--card-bg)',
        'card-border': 'var(--card-border)',
        'sidebar-bg': 'var(--sidebar-bg)',
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',

        // Retain legacy for gradient stops in default theme if needed, or map them
        'gta-pink': '#FFB6C1',
        'gta-purple': '#E6E6FA',
        'gta-orange': '#FFDAB9',
        'gta-teal': '#E0FFFF',

        // Marathon / Graphic Realism Palette
        'm-black': '#050505',
        'm-dark': '#0F0F0F',
        'm-gray': '#2A2A2A',
        'm-light': '#E5E5E5',
        'm-white': '#FAFAFA',
        'm-yellow': '#CCFF00', // Acid
        'm-orange': '#FF3300', // Safety
        'm-blue': '#00F0FF',   // Cyan
        'm-red': '#FF2A2A',
      },
      fontFamily: {
        'mono': ['Space Mono', 'JetBrains Mono', 'monospace'], // Technical feel
        'sans': ['Inter', 'Roboto', 'sans-serif'], // Keep clean sans
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #2a2a2a 1px, transparent 1px), linear-gradient(to bottom, #2a2a2a 1px, transparent 1px)",
      },
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'lifted': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'neumorphic-flat': '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
        'neumorphic-pressed': 'inset 6px 6px 10px 0 rgba(163,177,198, 0.7), inset -6px -6px 10px 0 rgba(255,255,255, 0.8)',
        'neumorphic-btn': '6px 6px 10px 0 rgba(163,177,198, 0.7), -6px -6px 10px 0 rgba(255,255,255, 0.8)',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

