import { defineConfig } from 'tsup'

export default defineConfig({
  cjsInterop: true,
  clean: true,
  entry: ['./src/*.ts'],
  format: ['cjs', 'esm'],
  shims: true,
  splitting: true,
  target: ['node18', 'es2022'],
  tsconfig: '../../tsconfig.lib.json',
  dts: {
    compilerOptions: {
      composite: false,
      paths: {},
    },
  },
})
