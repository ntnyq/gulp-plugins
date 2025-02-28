# gulp-diffable-html

:beer: gulp plugin formatting html via diffable-html

[![NPM VERSION](https://img.shields.io/npm/v/gulp-diffable-html?logo=npm)](https://www.npmjs.com/package/gulp-diffable-html)
[![NPM DOWNLOADS](https://img.shields.io/npm/dm/gulp-diffable-html?logo=npm)](https://www.npmjs.com/package/gulp-diffable-html)

## Install

```shell
npm install gulp-diffable-html -D
```

```shell
yarn add gulp-diffable-html -D
```

```shell
pnpm add gulp-diffable-html -D
```

## Setup

```js
const gulp = require('gulp')
const diffableHTML = require('gulp-diffable-html')
// or
// const { diffableHTML } = require(`gulp-diffable-html`)

function views() {
  return gulp
    .src('views/**/*.html')
    .pipe(diffableHTML())
    .pipe(gulp.dest('dist'))
}

exports.dev = gulp.series(views)
```

```ts
import gulp from 'gulp'
import diffableHTML from 'gulp-diffable-html'
// or
// import { diffableHTML } from 'gulp-diffable-html'

function views() {
  return gulp
    .src('views/**/*.html')
    .pipe(diffableHTML())
    .pipe(gulp.dest('dist'))
}

export const dev = gulp.series(views)
```

## Features

- zero-config
- indenting every level with 2 spaces
- align attributes
- put every opening and closing tag on its own line
- trimming text nodes

## Example

Input:

<!-- prettier-ignore-start -->
```html
<!DOCTYPE html><!--[if IE 9]>.... some HTML here ....<![endif]--><html lang="en"><head><meta charset="UTF-8"><title>gulp-diffable-html</title></head><body><header><h1><span>I am h1 in header</span></h1></header><main><p><!----><span></span><b>b</b><strong>strong</strong><em>&copy;</em><!-- This comment should be removed --></p></main><footer><p><a href="https://github.com/ntnyq/gulp-diffable-html" target="_blank" rel="noopener" >gulp-diffable-html</a></p></footer></body></html>
```
<!-- prettier-ignore-end -->

Output:

<!-- prettier-ignore-start -->
```html
<!DOCTYPE html>
<!--[if IE 9]>.... some HTML here ....<![endif]-->
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>
      gulp-diffable-html
    </title>
  </head>
  <body>
    <header>
      <h1>
        <span>
          I am h1 in header
        </span>
      </h1>
    </header>
    <main>
      <p>
        <span> </span>
        <b>
          b
        </b>
        <strong>
          strong
        </strong>
        <em>
          &copy;
        </em>
      </p>
    </main>
    <footer>
      <p>
        <a
          href="https://github.com/ntnyq/gulp-diffable-html"
          target="_blank"
          rel="noopener"
        >
          gulp-diffable-html
        </a>
      </p>
    </footer>
  </body>
</html>
```
<!-- prettier-ignore-end -->

## Options

**gulp-diffable-html** is based on [diffable-html](https://github.com/rayrutjes/diffable-html).

### sortAttributes

- **type** `function`
- **default** `(names) => names`

Customize the order of attributes on HTML tag.

### verbose

- **type** `boolean`
- **default** `false`

Display name of file from stream that is being formatting

## License

[MIT](./LICENSE) License © 2024-PRESENT [ntnyq](https://github.com/ntnyq)
