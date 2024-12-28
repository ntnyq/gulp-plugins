import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['dot'],
    coverage: {
      include: ['**/src/**/*.ts'],
      reporter: ['lcov', 'text'],
    },
  },
})
