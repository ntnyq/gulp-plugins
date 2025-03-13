# gulp-oxc-minify

[![NPM VERSION](https://img.shields.io/npm/v/gulp-oxc-minify?logo=npm)](https://www.npmjs.com/package/gulp-oxc-minify)
[![NPM DOWNLOADS](https://img.shields.io/npm/dm/gulp-oxc-minify?logo=npm)](https://www.npmjs.com/package/gulp-oxc-minify)

## Install

```shell
npm install gulp-oxc-minify -D
```

```shell
yarn add gulp-oxc-minify -D
```

```shell
pnpm add gulp-oxc-minify -D
```

## Setup

```js
const gulp = require('gulp')
const oxcMinify = require('gulp-oxc-minify')
// or
// const { oxcMinify } = require(`gulp-oxc-minify`)

function scripts() {
  return gulp
    .src('scripts/**/*.{js,ts}')
    .pipe(oxcMinify())
    .pipe(gulp.dest('dist'))
}

exports.dev = gulp.series(scripts)
```

```ts
import gulp from 'gulp'
import oxcMinify from 'gulp-oxc-minify'
// or
// import { oxcMinify } from 'gulp-oxc-minify'

function scripts() {
  return gulp
    .src('scripts/**/*.{js,ts}')
    .pipe(oxcMinify())
    .pipe(gulp.dest('dist'))
}

export const dev = gulp.series(scripts)
```

## Options

**gulp-oxc-minify** is powered by [oxc-minify](https://github.com/oxc-project/oxc/blob/main/crates/oxc_minifier).

```ts
export interface CodegenOptions {
  /**
   * Remove whitespace.
   *
   * @default true
   */
  removeWhitespace?: boolean
}

export interface CompressOptions {
  /**
   * Set desired EcmaScript standard version for output.
   *
   * Set `esnext` to enable all target highering.
   *
   * e.g.
   *
   * * catch optional binding when >= es2019
   * * `??` operator >= es2020
   *
   * @default 'esnext'
   */
  target?:
    | 'esnext'
    | 'es2015'
    | 'es2016'
    | 'es2017'
    | 'es2018'
    | 'es2019'
    | 'es2020'
    | 'es2021'
    | 'es2022'
    | 'es2023'
    | 'es2024'
  /**
   * Pass true to discard calls to `console.*`.
   *
   * @default false
   */
  dropConsole?: boolean
  /**
   * Remove `debugger;` statements.
   *
   * @default true
   */
  dropDebugger?: boolean
}

export interface MangleOptions {
  /**
   * Pass `true` to mangle names declared in the top level scope.
   *
   * @default false
   */
  toplevel?: boolean
  /** Debug mangled names. */
  debug?: boolean
}

export interface MinifyOptions {
  compress?: boolean | CompressOptions
  mangle?: boolean | MangleOptions
  codegen?: boolean | CodegenOptions
  sourcemap?: boolean
}
```

### verbose

- **type** `boolean`
- **default** `false`

Displat the filename that is being minifying.

## License

[MIT](./LICENSE) License © 2025-PRESENT [ntnyq](https://github.com/ntnyq)
