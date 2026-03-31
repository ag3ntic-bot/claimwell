/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4B5F7E',
          dim: '#3F5371',
          container: '#D4E3FF',
          fixed: { dim: '#3F5371' },
        },
        secondary: {
          DEFAULT: '#4E607C',
          container: '#D4E3FF',
        },
        tertiary: {
          DEFAULT: '#7D5731',
          container: '#FAC898',
        },
        error: {
          DEFAULT: '#9F403D',
          container: '#FE8983',
        },
        surface: {
          DEFAULT: '#F9F9F9',
          bright: '#FFFFFF',
          dim: '#F0F2F2',
          container: {
            lowest: '#FFFFFF',
            low: '#F2F4F4',
            DEFAULT: '#EBEEEF',
            high: '#E3E6E7',
            highest: '#DBDEE0',
          },
          variant: '#DDE4E5',
        },
        on: {
          primary: {
            DEFAULT: '#FFFFFF',
            container: '#1A2A4A',
          },
          secondary: {
            DEFAULT: '#FFFFFF',
            container: '#1A2A4A',
          },
          tertiary: {
            DEFAULT: '#FFFFFF',
            container: '#4A2E12',
          },
          error: {
            DEFAULT: '#FFFFFF',
            container: '#5C1A18',
          },
          surface: {
            DEFAULT: '#2D3435',
            variant: '#5A6061',
          },
        },
        outline: {
          DEFAULT: '#8A9192',
          variant: '#C4CBCC',
        },
      },
      fontFamily: {
        headline: ['Manrope'],
        body: ['Inter'],
        label: ['Inter'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-md': ['2.75rem', { lineHeight: '1.15', fontWeight: '800' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-lg': ['2rem', { lineHeight: '1.25', fontWeight: '700' }],
        'headline-md': ['1.75rem', { lineHeight: '1.3', fontWeight: '700' }],
        'headline-sm': ['1.5rem', { lineHeight: '1.35', fontWeight: '600' }],
        'title-lg': ['1.375rem', { lineHeight: '1.35', fontWeight: '600' }],
        'title-md': ['1rem', { lineHeight: '1.4', fontWeight: '600' }],
        'title-sm': ['0.875rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label-lg': ['0.875rem', { lineHeight: '1.4', fontWeight: '600' }],
        'label-md': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.75rem',
        lg: '0.5rem',
        xl: '1.5rem',
        '2xl': '2rem',
      },
      spacing: {
        '0.5': '0.125rem',
        '1': '0.25rem',
        '1.5': '0.375rem',
        '2': '0.5rem',
        '2.5': '0.625rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
      },
      boxShadow: {
        ambient: '0 0 24px rgba(45, 52, 53, 0.04)',
        'ambient-md': '0 4px 24px rgba(45, 52, 53, 0.04)',
        hover: '0 8px 32px rgba(0, 0, 0, 0.08)',
        elevated: '0 0 24px rgba(45, 52, 53, 0.06)',
      },
    },
  },
  plugins: [],
};
