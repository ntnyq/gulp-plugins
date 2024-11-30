import { describe, expect, it } from 'vitest'
import gulpAddBannerFooter, { addBannerOrFooter } from '../../packages/gulp-banner-footer/src'
import { createFakeFileCreator, createFile } from '../utils'
import type { Options } from '../../packages/gulp-banner-footer/src'
import type { StreamCreator } from '../utils'

const BANNER = `
/**
 * @license MIT
 */
`
const FOOTER = `// @license MIT`

const crateFakeFile = createFakeFileCreator('tests/gulp-banner-footer/fixtures/app.ts')

function runTests(streamCreator: StreamCreator<Options>) {
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
      stream.write(crateFakeFile())
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
      stream.write(crateFakeFile())
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
      stream.write(crateFakeFile())
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
      stream.write(crateFakeFile())
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
      stream.write(crateFakeFile())
    }))
}

describe('named export', () => {
  runTests(addBannerOrFooter)
})

describe('default export', () => {
  runTests(gulpAddBannerFooter)
})
