# gulp-banner-footer

:beer: gulp plugin for adding banner or footer to file.

[![NPM VERSION](https://img.shields.io/npm/v/gulp-banner-footer?logo=npm)](https://www.npmjs.com/package/gulp-banner-footer)
[![NPM DOWNLOADS](https://img.shields.io/npm/dm/gulp-banner-footer?logo=npm)](https://www.npmjs.com/package/gulp-banner-footer)

## Install

```bash
npm install gulp-banner-footer -D
```

```bash
yarn add gulp-banner-footer -D
```

```bash
pnpm add gulp-banner-footer -D
```

## Usage

```js
const gulp = require('gulp')
const addBannerOrFooter = require('gulp-banner-footer')
// or
// const { addBannerOrFooter } = require(`gulp-banner-footer`)

function styles() {
  return gulp
    .src('src/styles/**/*.css')
    .pipe(
      addBannerOrFooter({
        banner: file => `
/**
 * ${file.basename}
 * @author ntnyq
 * @license MIT
 */
`,
      }),
    )
    .pipe(gulp.dest('dist'))
}

exports.dev = gulp.series(styles)
```

```ts
import gulp from 'gulp'
import addBannerOrFooter from 'gulp-banner-footer'
// or
// import { addBannerOrFooter } from 'gulp-banner-footer'

const footer = `
/**
 * @author ntnyq
 * @license MIT
 */
`

function styles() {
  return gulp
    .src('src/styles/**/*.css')
    .pipe(
      addBannerOrFooter({
        footer,
      }),
    )
    .pipe(gulp.dest('dist'))
}

export const dev = gulp.series(styles)
```

## Options

### banner

- **type** `string | ((file: Vinyl) => string | undefined)`
- **default** `undefined`
- **required** `false`

static banner content or dynamic banner content based on file information.

### footer

- **type** `string | ((file: Vinyl) => string | undefined)`
- **default** `undefined`
- **required** `false`

static footer content or dynamic footer content based on file information.

### verbose

- **type** `boolean`
- **default** `false`
- **required** `false`

Display filename is being processed.

## Interface

```ts
interface Vinyl {
  contents: Buffer | NodeJS.ReadableStream | null
  cwd: string
  base: string
  path: string
  relative: string
  dirname: string
  basename: string
  stem: string
  extname: string
  isBuffer(): boolean
  isStream(): boolean
  isNull(): boolean
  isDirectory(): boolean
  isSymbolic(): boolean
}
```

## Difference from `gulp-banner`

- support add dynamic banner or footer
- support TypeScript
- support esm
- template is removed

## License

[MIT](./LICENSE) License © 2024-PRESENT [ntnyq](https://github.com/ntnyq)
