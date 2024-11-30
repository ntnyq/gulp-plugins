/* eslint-disable vitest/expect-expect */
import { describe, it } from 'vitest'
import gulpAddBannerFooter, { addBannerOrFooter } from '../../packages/gulp-banner-footer/src'
import { createFakeFileCreator, createFile, testTransformFile } from '../utils'
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
    testTransformFile({
      streamCreator,
      file: createFile(),
    }))

  it('Should add banner', () =>
    testTransformFile({
      streamCreator,
      file: crateFakeFile(),
      pluginOptions: {
        banner: BANNER,
      },
    }))

  it('Should add banner - function', () =>
    testTransformFile({
      streamCreator,
      file: crateFakeFile(),
      pluginOptions: {
        banner: file => `/**
* ${file.basename}
*/`,
      },
    }))

  it('Should add footer', () =>
    testTransformFile({
      file: crateFakeFile(),
      pluginOptions: {
        footer: FOOTER,
      },
      streamCreator,
    }))

  it('Should add footer - function', () =>
    testTransformFile({
      streamCreator,
      file: crateFakeFile(),
      pluginOptions: {
        footer: file => `// ${file.basename}`,
      },
    }))

  it('Should verbose work', () =>
    testTransformFile({
      streamCreator,
      file: crateFakeFile(),
      pluginOptions: {
        verbose: true,
      },
    }))
}

describe('named export', () => {
  runTests(addBannerOrFooter)
})

describe('default export', () => {
  runTests(gulpAddBannerFooter)
})
