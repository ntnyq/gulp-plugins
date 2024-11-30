import { describe, expect, it } from 'vitest'
import gulpFormatHTML, { formatHTML } from '../../packages/gulp-format-html/src'
import { createFakeFileCreator, createFile, toStream } from '../utils'
import type { Buffer } from 'node:buffer'
import type { Options } from '../../packages/gulp-format-html/src'
import type { StreamCreator } from '../utils'

const createFakeFile = createFakeFileCreator('tests/gulp-format-html/fixtures/index.html')

function runTests(streamCreator: StreamCreator<Options>) {
  describe('file', () => {
    it('Should ignore empty file', () =>
      new Promise<void>((resolve, reject) => {
        const stream = streamCreator()

        stream.on('error', reject)
        stream.on('data', file => {
          expect(file.isNull()).toBeTruthy()
          resolve()
        })
        stream.write(createFile())
      }))

    it('Should format my HTML files as expected', () =>
      new Promise<void>((resolve, reject) => {
        const stream = streamCreator()

        stream.on('error', reject)
        stream.on('data', file => {
          expect(file).toBeDefined()
          expect(file.isBuffer()).toBeTruthy()
          expect(file.contents.toString().trim()).toMatchSnapshot()
          resolve()
        })
        stream.write(createFakeFile())
      }))

    it('Should works well when option verbose set', () =>
      new Promise<void>((resolve, reject) => {
        const stream = streamCreator({ verbose: true })

        stream.on('error', reject)
        stream.on('data', file => {
          expect(file).toBeDefined()
          expect(file.isBuffer()).toBeTruthy()
          expect(file.contents.toString().trim()).toMatchSnapshot()
          resolve()
        })
        stream.write(createFakeFile())
      }))
  })

  describe('stream', () => {
    it('Should format my HTML files', () =>
      new Promise<void>((resolve, reject) => {
        const fixture = createFile({ contents: toStream(createFakeFile().contents) })
        const stream = streamCreator()

        stream.on('error', reject)
        stream.on('data', file => {
          expect(file).toBeDefined()
          expect(file.isStream()).toBeTruthy()

          file.contents.on('data', (data: Buffer) => {
            expect(data.toString().trim()).toMatchSnapshot()
            resolve()
          })
        })
        stream.write(fixture)
      }))
  })
}

describe('named export', () => {
  runTests(formatHTML)
})

describe('default export', () => {
  runTests(gulpFormatHTML)
})
