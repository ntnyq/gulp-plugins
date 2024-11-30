import fs from 'node:fs'
import path from 'node:path'
import File from 'vinyl'
import { describe, expect, it } from 'vitest'
import gulpAddBannerFooter, { addBannerOrFooter } from '../src'
import type { Transform } from 'node:stream'
import type { Options } from '../src'

const resolve = (...args: string[]): string => path.resolve(__dirname, ...args)

type StreamCreator = (options?: Options) => Transform

const BANNER = `
/**
 * @license MIT
 */
`
const FOOTER = `// @license MIT`
const fakeFilePath = resolve('fixtures/app.ts')
const fakeFileContent = fs.readFileSync(fakeFilePath)

function getFakeFile() {
  return new File({
    path: fakeFilePath,
    contents: fakeFileContent,
  })
}

function runTests(streamCreator: StreamCreator) {
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

  it('Should add banner', () =>
    new Promise<void>((resolve, reject) => {
      const stream = streamCreator({
        banner: BANNER,
      })

      stream.on('error', reject)
      stream.on('data', file => {
        expect(file).toBeDefined()
        expect(file.isBuffer()).toBeTruthy()
        expect(file.contents.toString().trim()).toMatchSnapshot()
        resolve()
      })
      stream.write(getFakeFile())
    }))

  it('Should add banner - function', () =>
    new Promise<void>((resolve, reject) => {
      const stream = streamCreator({
        banner: file => `/**
* ${file.basename}
*/`,
      })

      stream.on('error', reject)
      stream.on('data', file => {
        expect(file).toBeDefined()
        expect(file.isBuffer()).toBeTruthy()
        expect(file.contents.toString().trim()).toMatchSnapshot()
        resolve()
      })
      stream.write(getFakeFile())
    }))

  it('Should add footer', () =>
    new Promise<void>((resolve, reject) => {
      const stream = streamCreator({
        footer: FOOTER,
      })

      stream.on('error', reject)
      stream.on('data', file => {
        expect(file).toBeDefined()
        expect(file.isBuffer()).toBeTruthy()
        expect(file.contents.toString().trim()).toMatchSnapshot()
        resolve()
      })
      stream.write(getFakeFile())
    }))

  it('Should add footer - function', () =>
    new Promise<void>((resolve, reject) => {
      const stream = streamCreator({
        footer: file => `// ${file.basename}`,
      })

      stream.on('error', reject)
      stream.on('data', file => {
        expect(file).toBeDefined()
        expect(file.isBuffer()).toBeTruthy()
        expect(file.contents.toString().trim()).toMatchSnapshot()
        resolve()
      })
      stream.write(getFakeFile())
    }))

  it('Should verbose work', () =>
    new Promise<void>((resolve, reject) => {
      const stream = streamCreator({ verbose: true })

      stream.on('error', reject)
      stream.on('data', file => {
        expect(file).toBeDefined()
        expect(file.isBuffer()).toBeTruthy()
        expect(file.contents.toString().trim()).toMatchSnapshot()
        resolve()
      })
      stream.write(getFakeFile())
    }))
}

describe('named export', () => {
  runTests(addBannerOrFooter)
})

describe('default export', () => {
  runTests(gulpAddBannerFooter)
})
