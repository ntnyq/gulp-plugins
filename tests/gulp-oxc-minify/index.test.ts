import { describe, it } from 'vitest'
import gulpOxcMinify, { oxcMinify } from '../../packages/gulp-oxc-minify/src'
import type { Options } from '../../packages/gulp-oxc-minify/src'
import {
  createFakeFileCreator,
  createFile,
  testTransformFile,
  testTransformStream,
} from '../utils'
import type { StreamCreator } from '../utils'

const createFakeFile = createFakeFileCreator(
  'tests/gulp-oxc-minify/fixtures/index.ts',
)

function runTests(streamCreator: StreamCreator<Options>) {
  describe('file', () => {
    it('should ignore empty file', () =>
      testTransformFile({
        streamCreator,
        file: createFile(),
      }))

    it('should minify files as expected', () =>
      testTransformFile({
        streamCreator,
        file: createFakeFile(),
      }))

    it('should works well when option verbose set', () =>
      testTransformFile({
        streamCreator,
        file: createFakeFile(),
        pluginOptions: {
          verbose: true,
        },
      }))
  })

  describe('stream', () => {
    it('should minify files', () =>
      testTransformStream({
        streamCreator,
        file: createFakeFile(),
      }))

    it('should minify multi-chunk stream', () =>
      testTransformStream({
        streamCreator,
        file: createFakeFile(),
        streamChunkSize: 8,
      }))
  })
}

describe('named export', () => {
  runTests(oxcMinify)
})

describe('default export', () => {
  runTests(gulpOxcMinify)
})
