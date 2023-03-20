# gulp-format-html

[![NPM VERSION](https://img.shields.io/npm/v/gulp-format-html?logo=npm)](https://www.npmjs.com/package/gulp-format-html)
[![NPM DOWNLOADS](https://img.shields.io/npm/dm/gulp-format-html?logo=npm)](https://www.npmjs.com/package/gulp-format-html)

## Install

```bash
npm install gulp-format-html -D
```

```bash
yarn add gulp-format-html -D
```

```bash
pnpm add gulp-format-html -D
```

## Setup

```js
const gulp = require('gulp')
const formatHTML = require('gulp-format-html')
// or
// const { formatHTML } = require(`gulp-format-html`)

function views() {
  return gulp.src('views/**/*.html').pipe(formatHTML()).pipe(gulp.dest('dist'))
}

exports.dev = gulp.series(views)
```

```ts
import gulp from 'gulp'
import formatHTML from 'gulp-format-html'
// or
// import { formatHTML } from 'gulp-format-html'

function views() {
  return gulp.src('views/**/*.html').pipe(formatHTML()).pipe(gulp.dest('dist'))
}

export const dev = gulp.series(views)
```

## Example

Input:

<!-- prettier-ignore-start -->
```html
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>gulp-format-html</title></head><body><header><h1><span>I am h1 in header</span></h1></header><main><p><span>span</span><b>b</b><strong>strong</strong><em>em</em></p></main><footer><p><a href="https://github.com/ntnyq/gulp-format-html">gulp-format-html</a></p></footer></body></html>
```
<!-- prettier-ignore-end -->

Output:

<!-- prettier-ignore-start -->
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>gulp-format-html</title>
  </head>

  <body>
    <header>
      <h1>
        <span>I am h1 in header</span>
      </h1>
    </header>
    <main>
      <p>
        <span>span</span>
        <b>b</b>
        <strong>strong</strong>
        <em>em</em>
      </p>
    </main>
    <footer>
      <p>
        <a href="https://github.com/ntnyq/gulp-format-html">gulp-format-html</a>
      </p>
    </footer>
  </body>
</html>
```
<!-- prettier-ignore-end -->

## Options

**gulp-format-html** is based on [js-beautify](https://github.com/beautify-web/js-beautify), Check it's [HTML options](https://github.com/beautify-web/js-beautify#css--html) for detail.

### verbose

- **type** `boolean`
- **default** `false`

Display name of file from stream that is being formatting

## Related

- [gulp-diffable-html](https://github.com/ntnyq/gulp-diffable-html) Zero config HTML formatter to make HTML more readable and to indent HTML tag text in a single newline.
