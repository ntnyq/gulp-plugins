import { defineConfig } from 'tsup'

export default defineConfig({
  cjsInterop: true,
  clean: true,
  dts: true,
  entry: ['./src/*.ts'],
  format: ['cjs', 'esm'],
  shims: true,
  splitting: true,
  target: ['node18', 'es2022'],
})
