import { describe, it } from 'vitest'
import gulpOxcMinify, { oxcMinify } from '../../packages/gulp-oxc-minify/src'
import {
  createFakeFileCreator,
  createFile,
  testTransformFile,
  testTransformStream,
} from '../utils'
import type { Options } from '../../packages/gulp-oxc-minify/src'
import type { StreamCreator } from '../utils'

const createFakeFile = createFakeFileCreator(
  'tests/gulp-oxc-minify/fixtures/index.ts',
)

function runTests(streamCreator: StreamCreator<Options>) {
  describe('file', () => {
    it('Should ignore empty file', () =>
      testTransformFile({
        streamCreator,
        file: createFile(),
      }))

    it('Should minify files as expected', () =>
      testTransformFile({
        streamCreator,
        file: createFakeFile(),
      }))

    it('Should works well when option verbose set', () =>
      testTransformFile({
        streamCreator,
        file: createFakeFile(),
        pluginOptions: {
          verbose: true,
        },
      }))
  })

  describe('stream', () => {
    it('Should minify files', () =>
      testTransformStream({
        streamCreator,
        file: createFakeFile(),
      }))
  })
}

describe('named export', () => {
  runTests(oxcMinify)
})

describe('default export', () => {
  runTests(gulpOxcMinify)
})
