const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'), ...createGlobPatternsForDependencies(__dirname)],
  theme: {
    extend: {
      colors: {
        primary: 'var(--tui-primary)',
        'primary-hover': 'var(--tui-primary-hover)',
        'primary-active': 'var(--tui-primary-active)',
        secondary: 'var(--tui-secondary)',
        'secondary-hover': 'var(--tui-primary-hover)',
        'secondary-active': 'var(--tui-primary-active)',
        accent: 'var(--tui-accent)',
        'accent-hover': 'var(--tui-primary-hover)',
        'accent-active': 'var(--tui-primary-active)',
        error: 'var(--tui-error-fill)'
      }
    }
  },
  plugins: []
};
