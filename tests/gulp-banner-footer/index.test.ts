import { describe, it } from 'vitest'
import gulpAddBannerFooter, {
  addBannerOrFooter,
} from '../../packages/gulp-banner-footer/src'
import type { Options } from '../../packages/gulp-banner-footer/src'
import { createFakeFileCreator, createFile, testTransformFile } from '../utils'
import type { StreamCreator } from '../utils'

const BANNER = `
/**
 * @license MIT
 */
`
const FOOTER = `// @license MIT`

const crateFakeFile = createFakeFileCreator(
  'tests/gulp-banner-footer/fixtures/app.ts',
)

function runTests(streamCreator: StreamCreator<Options>) {
  it('should ignore empty file', () =>
    testTransformFile({
      streamCreator,
      file: createFile(),
    }))

  it('should add banner', () =>
    testTransformFile({
      streamCreator,
      file: crateFakeFile(),
      pluginOptions: {
        banner: BANNER,
      },
    }))

  it('should add banner - function', () =>
    testTransformFile({
      streamCreator,
      file: crateFakeFile(),
      pluginOptions: {
        banner: file => `/**
* ${file.basename}
*/`,
      },
    }))

  it('should add footer', () =>
    testTransformFile({
      file: crateFakeFile(),
      pluginOptions: {
        footer: FOOTER,
      },
      streamCreator,
    }))

  it('should add footer - function', () =>
    testTransformFile({
      streamCreator,
      file: crateFakeFile(),
      pluginOptions: {
        footer: file => `// ${file.basename}`,
      },
    }))

  it('should not change file when banner/footer are missing', () =>
    testTransformFile({
      streamCreator,
      file: crateFakeFile(),
    }))

  it('should verbose work', () =>
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
