import { describe, it } from 'vitest'
import gulpDiffableHTML, {
  diffableHTML,
} from '../../packages/gulp-diffable-html/src'
import type { Options } from '../../packages/gulp-diffable-html/src'
import {
  createFakeFileCreator,
  createFile,
  testTransformFile,
  testTransformStream,
} from '../utils'
import type { StreamCreator } from '../utils'

const createFakeFile = createFakeFileCreator(
  'tests/gulp-diffable-html/fixtures/index.html',
)

function runTests(streamCreator: StreamCreator<Options>) {
  describe('file', () => {
    it('should ignore empty file', () =>
      testTransformFile({
        streamCreator,
        file: createFile(),
      }))

    it('should format my HTML files as expected', () =>
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

    it('should sort attributes as expected', () =>
      testTransformFile({
        streamCreator,
        file: createFakeFile(),
        pluginOptions: {
          sortAttributes: (names: string[]) => names.sort(),
        },
      }))
  })

  describe('stream', () => {
    it('should format my HTML files', () =>
      testTransformStream({
        streamCreator,
        file: createFakeFile(),
      }))

    it('should format multi-chunk HTML stream', () =>
      testTransformStream({
        streamCreator,
        file: createFakeFile(),
        streamChunkSize: 8,
      }))
  })
}

describe('named export', () => {
  runTests(diffableHTML)
})

describe('default export', () => {
  runTests(gulpDiffableHTML)
})
