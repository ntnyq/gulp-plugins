import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/*.ts'],
  format: ['cjs', 'esm'],
  target: ['node18', 'es2022'],
  dts: {
    compilerOptions: {
      paths: {},
      composite: false,
    },
  },
  clean: true,
  shims: true,
  cjsInterop: true,
  splitting: true,
  tsconfig: '../../tsconfig.lib.json',
})
