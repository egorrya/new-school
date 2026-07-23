/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: [
            {
              color: 'var(--foreground)',
              '--tw-prose-body': 'var(--foreground)',
              '--tw-prose-headings': 'var(--foreground)',
              '--tw-prose-lead': 'var(--foreground)',
              '--tw-prose-links': 'var(--accent-coral)',
              '--tw-prose-bold': 'var(--foreground)',
              '--tw-prose-counters': 'var(--foreground)',
              '--tw-prose-bullets': 'var(--foreground)',
              '--tw-prose-hr': 'var(--border)',
              '--tw-prose-quotes': 'var(--foreground)',
              '--tw-prose-quote-borders': 'var(--main)',
              '--tw-prose-captions': 'var(--muted-foreground)',
              '--tw-prose-code': 'var(--foreground)',
              '--tw-prose-pre-code': 'var(--foreground)',
              '--tw-prose-pre-bg': 'var(--card)',
              '--tw-prose-th-borders': 'var(--border)',
              '--tw-prose-td-borders': 'var(--border)',
              a: {
                textDecorationThickness: '2px',
                textUnderlineOffset: '0.18em',
              },
              h1: {
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                fontWeight: '800',
                letterSpacing: '-0.05em',
                lineHeight: '1.1',
                marginBottom: '0.35em',
              },
              h2: {
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                fontWeight: '800',
                letterSpacing: '-0.04em',
                lineHeight: '1.1',
              },
              h3: {
                fontFamily: 'var(--font-heading)',
                fontSize: '1.125rem',
                fontWeight: '800',
                letterSpacing: '-0.03em',
                lineHeight: '1.1',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.5rem',
                fontWeight: 800,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '4rem',
              },
              h2: {
                fontSize: '2rem',
                fontWeight: 800,
              },
            },
          ],
        },
      },
    },
  },
}

export default config
