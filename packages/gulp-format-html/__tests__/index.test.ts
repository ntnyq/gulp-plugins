import fs from 'node:fs'
import path from 'node:path'
import through from 'through2'
import File from 'vinyl'
import { describe, expect, it } from 'vitest'
import format, { formatHTML } from '../src'
import type { Options } from '../src'
import type { Transform } from 'node:stream'

type StreamCreator = (options?: Options) => Transform

const resolve = (...args: string[]): string => path.resolve(__dirname, ...args)

function toStream(contents: Buffer): Transform {
  const stream = through()
  stream.write(contents)
  return stream
}

const fakeFilePath = resolve('fixtures/index.html')
const fakeFileContent = fs.readFileSync(fakeFilePath)
const fakeFile = new File({
  path: fakeFilePath,
  contents: fakeFileContent,
})

function runTests(streamCreator: StreamCreator) {
  describe('file-contents - buffer', () => {
    it('Should ignore empty file', () =>
      new Promise<void>((resolve, reject) => {
        const stream = streamCreator()

        stream.on('error', reject)
        stream.on('data', file => {
          expect(file.isNull()).toBeTruthy()
          resolve()
        })
        stream.write(new File({}))
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
        stream.write(fakeFile)
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
        stream.write(fakeFile)
      }))
  })

  describe('file-contents - stream', () => {
    it('Should format my HTML files', () =>
      new Promise<void>((resolve, reject) => {
        const fixture = new File({ contents: toStream(fakeFileContent) })
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
  runTests(format)
})
