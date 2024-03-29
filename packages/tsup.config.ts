import process from 'node:process'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/*.ts'],
  format: ['cjs', 'esm'],
  target: ['node18', 'es2022'],
  clean: true,
  shims: true,
  cjsInterop: true,
  splitting: true,
  watch: !!process.env.DEV,
  tsconfig: '../../tsconfig.lib.json',
  dts: process.env.DEV
    ? false
    : {
        compilerOptions: {
          paths: {},
          composite: false,
        },
      },
})
