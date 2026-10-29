import next from '@next/eslint-plugin-next'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import base from './base.js'

export default tseslint.config(...base, {
  plugins: { '@next/next': next },
  languageOptions: { globals: globals.browser },
  rules: {
    ...next.configs.recommended.rules,
    ...next.configs['core-web-vitals'].rules,
  },
})
