import type { Transform } from 'stream'
import fs from 'fs'
import path from 'path'
import through from 'through2'
import File from 'vinyl'
import { describe, expect, it } from 'vitest'
import format from '../lib'

const resolve = (...args: string[]): string => path.resolve(__dirname, ...args)

function toStream (contents: Buffer): Transform {
  const stream = through()
  stream.write(contents)
  return stream
}

const fakeFilePath = resolve(`fixtures/index.html`)
const fakeFileContent = fs.readFileSync(fakeFilePath)
const fakeFile = new File({
  path: fakeFilePath,
  contents: fakeFileContent,
})

describe(`gulp-format-html`, () => {
  describe(`file-contents - buffer`, () => {
    it(`Should ignore empty file`, () => new Promise<void>((resolve, reject) => {
      const stream = format()

      stream.on(`error`, reject)
      stream.on(`data`, file => {
        expect(file.isNull()).toBe(true)
        resolve()
      })
      stream.write(new File({}))
    }))

    it(`Should format my HTML files as expected`, () => new Promise<void>((resolve, reject) => {
      const stream = format()

      stream.on(`error`, reject)
      stream.on(`data`, file => {
        expect(file).toBeDefined()
        expect(file.isBuffer()).toBe(true)
        expect(file.contents.toString().trim()).toMatchInlineSnapshot(`
          "<!DOCTYPE html>
          <html lang=\\"en\\">

          <head>
            <meta charset=\\"UTF-8\\">
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
                <a href=\\"https://github.com/ntnyq/gulp-format-html\\">gulp-format-html</a>
              </p>
            </footer>
          </body>

          </html>"
        `)
        resolve()
      })
      stream.write(fakeFile)
    }))

    it(`Should works well when option verbose set`, () => new Promise<void>((resolve, reject) => {
      const stream = format({ verbose: true })

      stream.on(`error`, reject)
      stream.on(`data`, file => {
        expect(file).toBeDefined()
        expect(file.isBuffer()).toBe(true)
        expect(file.contents.toString().trim()).toMatchInlineSnapshot(`
          "<!DOCTYPE html>
          <html lang=\\"en\\">

          <head>
            <meta charset=\\"UTF-8\\">
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
                <a href=\\"https://github.com/ntnyq/gulp-format-html\\">gulp-format-html</a>
              </p>
            </footer>
          </body>

          </html>"
        `)
        resolve()
      })
      stream.write(fakeFile)
    }))
  })

  describe(`file-contents - stream`, () => {
    it(`Should format my HTML files`, () => new Promise<void>((resolve, reject) => {
      const fixture = new File({ contents: toStream(fakeFileContent) })
      const stream = format()

      stream.on(`error`, reject)
      stream.on(`data`, file => {
        expect(file).toBeDefined()
        expect(file.isStream()).toBe(true)

        file.contents.on(`data`, data => {
          expect(data.toString().trim()).toMatchInlineSnapshot(`
            "<!DOCTYPE html>
            <html lang=\\"en\\">

            <head>
              <meta charset=\\"UTF-8\\">
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
                  <a href=\\"https://github.com/ntnyq/gulp-format-html\\">gulp-format-html</a>
                </p>
              </footer>
            </body>

            </html>"
          `)
          resolve()
        })
      })
      stream.write(fixture)
    }))
  })
})
