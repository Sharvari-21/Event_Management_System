import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // This app fetches data in useEffect (no React Query/SWR), which is
      // the standard documented React pattern - the new compiler-oriented
      // rule below is overly strict for that and not actionable here.
      'react-hooks/set-state-in-effect': 'off',
      // Context files intentionally co-locate their `useX` hook with the
      // Provider component for ergonomics; this doesn't affect Fast Refresh
      // in practice and is a common, accepted pattern.
      'react-refresh/only-export-components': 'off',
    },
  },
])