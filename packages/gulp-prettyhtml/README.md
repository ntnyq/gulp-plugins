# gulp-prettyhtml

[![NPM VERSION](https://img.shields.io/npm/v/gulp-prettyhtml.svg)](https://www.npmjs.com/package/gulp-prettyhtml)
[![NPM DOWNLOADS](https://img.shields.io/npm/dm/gulp-prettyhtml.svg)](https://www.npmjs.com/package/gulp-prettyhtml)

## Install

```bash
$ npm install gulp-prettyhtml --save-dev
# OR
$ yarn add gulp-prettyhtml -D
```

## Setup

```js
const gulp = require(`gulp`)
const prettyHtml = require(`gulp-prettyhtml`)

function views () {
  return gulp.src(`views/**/*.html`).pipe(prettyHtml()).pipe(gulp.dest(`dist`))
}

exports.dev = gulp.series(views)
```

## Example

Input:

<!-- prettier-ignore-start -->
```html
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>gulp-prettyhtml</title></head><body><header><h1><span>I am h1 in header</span></h1></header><main><p><span>span</span><b>b</b><strong>strong</strong><em>em</em></p></main><footer><p><a href="https://github.com/ntnyq/gulp-prettyhtml">gulp-prettyhtml</a></p></footer></body></html>
```
<!-- prettier-ignore-end -->

Output:

<!-- prettier-ignore-start -->
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>gulp-prettyhtml</title>
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
        <a href="https://github.com/ntnyq/gulp-prettyhtml">gulp-prettyhtml</a>
      </p>
    </footer>
  </body>
</html>
```
<!-- prettier-ignore-end -->

## Options

**gulp-prettyhtml** is based on [js-beautify](https://github.com/beautify-web/js-beautify), Check it's [HTML options](https://github.com/beautify-web/js-beautify#css--html) for detail.

### verbose

-   **type** `boolean`
-   **default** `false`

Display name of file from stream that is being formatting

## Related

-   [gulp-diffable-html](https://github.com/ntnyq/gulp-diffable-html) Zero config HTML formatter to make HTML more readable and to indent HTML tag text in a single newline.