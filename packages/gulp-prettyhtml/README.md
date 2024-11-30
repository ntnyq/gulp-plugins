# @ntnyq/gulp-prettyhtml

[![NPM VERSION](https://img.shields.io/npm/v/@ntnyq/gulp-prettyhtml?logo=npm)](https://www.npmjs.com/package/@ntnyq/gulp-prettyhtml)
[![NPM DOWNLOADS](https://img.shields.io/npm/dm/@ntnyq/gulp-prettyhtml?logo=npm)](https://www.npmjs.com/package/@ntnyq/gulp-prettyhtml)

> [!IMPORTANT]
> The formatter [@starptech/prettyhtml](https://github.com/Prettyhtml/prettyhtml#readme) is [no longer maintained](https://github.com/Prettyhtml/prettyhtml/issues/143#issuecomment-856633878).
>
> Please switch to other formatters ASAP. You can check [gulp-format-html](https://github.com/ntnyq/gulp-plugins/packages/gulp-format-html).

## Install

```bash
npm install @ntnyq/gulp-prettyhtml -D
```

```bash
yarn add @ntnyq/gulp-prettyhtml -D
```

```bash
pnpm add @ntnyq/gulp-prettyhtml -D
```

## Setup

```js
const prettyHTML = require('@ntnyq/gulp-prettyhtml')
const gulp = require('gulp')
// or
// const { prettyHTML } = require(`@ntnyq/gulp-prettyhtml`)

function views() {
  return gulp.src('views/**/*.html').pipe(prettyHTML()).pipe(gulp.dest('dist'))
}

exports.dev = gulp.series(views)
```

```ts
import prettyHTML from '@ntnyq/gulp-prettyhtml'
import gulp from 'gulp'
// or
// import { prettyHTML } from '@ntnyq/gulp-prettyhtml'

function views() {
  return gulp.src('views/**/*.html').pipe(prettyHTML()).pipe(gulp.dest('dist'))
}

export const dev = gulp.series(views)
```

## Example

Input:

<!-- prettier-ignore-start -->
```html
<!DOCTYPE html><!--[if IE 9]>.... some HTML here ....<![endif]--><html lang="en"><head><meta charset="UTF-8"><title>@ntnyq/gulp-prettyhtml</title></head><body><header><h1><span>I am h1 in header</span></h1></header><main><p><!----><span></span><b>b</b><strong>strong</strong><em>&copy;</em></p></main><footer><p><a href="https://github.com/ntnyq/gulp-plugins/tree/main/packages/@ntnyq/gulp-prettyhtml" target="_blank" rel="noopener" >gulp-prettyhtml</a></p></footer></body></html>

```
<!-- prettier-ignore-end -->

Output:

<!-- prettier-ignore-start -->
```html
<!doctype html>
<!--[if IE 9]>.... some HTML here ....<![endif]-->

<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>@ntnyq/gulp-prettyhtml</title>
</head>
<body>
  <header>
    <h1>
      <span>I am h1 in header</span>
    </h1>
  </header>
  <main>
    <p>
      <!---->
      <span></span>
      <b>b</b>
      <strong>strong</strong>
      <em>&copy;</em>
    </p>
  </main>
  <footer>
    <p>
      <a
        href="https://github.com/ntnyq/gulp-plugins/tree/main/packages/gulp-prettyhtml"
        target="_blank"
        rel="noopener"
      >@ntnyq/gulp-prettyhtml</a>
    </p>
  </footer>
</body>
</html>
```
<!-- prettier-ignore-end -->

## Options

**@ntnyq/gulp-prettyhtml** is based on [@starptech/prettyhtml](https://github.com/Prettyhtml/prettyhtml#readme). All it's [options](https://github.com/Prettyhtml/prettyhtml#prettyhtmldoc-string-options-vfile) is supported.

### verbose

- **type** `boolean`
- **default** `false`

Display name of file from stream that is being formatting

## Related

- [gulp-diffable-html](https://github.com/ntnyq/gulp-diffable-html) Zero config HTML formatter to make HTML more readable and to indent HTML tag text in a single newline.

## License

[MIT](./LICENSE) License © 2024-PRESENT [ntnyq](https://github.com/ntnyq)
