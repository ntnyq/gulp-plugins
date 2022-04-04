import fs from 'fs'
import path from 'path'
import { Transform } from 'stream'
import through from 'through2'
import File from 'vinyl'
import { describe, it, expect } from 'vitest'
import format from '../lib'

const resolve = (...args: string[]): string => path.resolve(__dirname, ...args)

function toStream (contents): Transform {
  const stream = through()

  stream.write(contents)
  return stream
}

const fakeFilePath = resolve('fixtures/index.html')
const expectedFilePath = resolve('expected/index.html')
const fakeFileContent = fs.readFileSync(fakeFilePath)
const fakeFile = new File({
  path: fakeFilePath,
  contents: fakeFileContent,
})
const expected = fs.readFileSync(expectedFilePath, 'utf8')

describe('gulp-diffable-html', () => {
  describe('file-contents - buffer', () => {
    it('Should ignore empty file', done => {
      const stream = format()

      stream.on('error', done)
      stream.on('data', file => {
        expect(file.isNull()).toBe(true)
        done()
      })
      stream.write(new File({}))
    })

    it('Should format my HTML files as expected', done => {
      const stream = format()

      stream.on('error', done)
      stream.on('data', file => {
        expect(file).toBeDefined()
        expect(file.isBuffer()).toBe(true)
        expect(file.contents.toString().trim()).toBe(expected.trim())
        done()
      })
      stream.write(fakeFile)
    })

    it('Should works well when option verbose set', done => {
      const stream = format({ verbose: true })

      stream.on('error', done)
      stream.on('data', file => {
        expect(file).toBeDefined()
        expect(file.isBuffer()).toBe(true)
        expect(file.contents.toString().trim()).toBe(expected.trim())
        done()
      })
      stream.write(fakeFile)
    })

    describe('file-contents - stream', () => {
      it('Should format my HTML files', done => {
        const fixture = new File({ contents: toStream(fakeFileContent) })
        const stream = format()

        stream.on('error', done)
        stream.on('data', file => {
          expect(file).toBeDefined()
          expect(file.isStream()).toBe(true)

          file.contents.on('data', data => {
            expect(data.toString().trim()).toBe(expected.trim())
            done()
          })
        })
        stream.write(fixture)
      })
    })
  })
})