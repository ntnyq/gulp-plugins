/* eslint-disable vitest/expect-expect */
import { describe, it } from 'vitest'
import gulpDiffableHTML, { diffableHTML } from '../../packages/gulp-diffable-html/src'
import { createFakeFileCreator, createFile, testTransformFile, testTransformStream } from '../utils'
import type { Options } from '../../packages/gulp-diffable-html/src'
import type { StreamCreator } from '../utils'

const createFakeFile = createFakeFileCreator('tests/gulp-diffable-html/fixtures/index.html')

function runTests(streamCreator: StreamCreator<Options>) {
  describe('file', () => {
    it('Should ignore empty file', () =>
      testTransformFile({
        streamCreator,
        file: createFile(),
      }))

    it('Should format my HTML files as expected', () =>
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

    it('Should sort attributes as expected', () =>
      testTransformFile({
        streamCreator,
        file: createFakeFile(),
        pluginOptions: {
          sortAttributes: (names: string[]) => names.sort(),
        },
      }))
  })

  describe('stream', () => {
    it('Should format my HTML files', () =>
      testTransformStream({
        streamCreator,
        file: createFakeFile(),
      }))
  })
}

describe('named export', () => {
  runTests(diffableHTML)
})

describe('default export', () => {
  runTests(gulpDiffableHTML)
})
