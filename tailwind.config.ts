// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:     ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary:   'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent:    'var(--color-accent)',
        ink:       'var(--color-ink)',
        muted:     'var(--color-muted)',
        surface:   'var(--color-surface)',
        bg:        'var(--color-bg)',
      },
    },
  },
  plugins: [],
};

export default config;
