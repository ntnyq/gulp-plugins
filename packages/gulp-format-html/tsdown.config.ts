import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['./src/index.ts'],
  format: ['cjs', 'esm'],
  platform: 'node',
  shims: true,
  target: ['node20', 'es2023'],
})
