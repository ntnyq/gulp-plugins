// @ts-check

import { defineESLintConfig } from '@ntnyq/eslint-config'

export default defineESLintConfig({
  test: {
    overridesVitestRules: {
      'vitest/expect-expect': 'off',
    },
  },
})
