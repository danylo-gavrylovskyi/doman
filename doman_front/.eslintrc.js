module.exports = {
  root: true,
  plugins: ['import'],
  extends: [
    'next/core-web-vitals',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        pathGroups: [
          { pattern: '@/redux/**', group: 'internal', position: 'after' },
          { pattern: '@/services/**', group: 'internal', position: 'after' },
          { pattern: '@/modules/**', group: 'internal', position: 'after' },
          { pattern: '@/components/**', group: 'internal', position: 'after' },
          { pattern: '@/hooks/**', group: 'internal', position: 'after' },
          { pattern: '@/utils/**', group: 'internal', position: 'after' },
          { pattern: '@/types/**', group: 'internal', position: 'after' },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
      },
    ],
  },
};
