const fs = require('fs')
const path = require('path')
const through = require('through2')
const File = require('vinyl')
const format = require('..')

const resolve = (...args) => path.resolve(__dirname, ...args)

function toStream (contents) {
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
        expect(file.contents.toString()).toBe(expected)
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
        expect(file.contents.toString()).toBe(expected)
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
            expect(data.toString()).toBe(expected)
            done()
          })
        })
        stream.write(fixture)
      })
    })
  })
})
