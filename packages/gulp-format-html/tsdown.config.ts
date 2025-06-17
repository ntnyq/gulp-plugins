import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['./src/index.ts'],
  format: ['cjs', 'esm'],
  shims: true,
  target: ['node18', 'es2022'],
})
