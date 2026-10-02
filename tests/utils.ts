import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import type { Transform } from 'node:stream'
import through from 'through2'
import File from 'vinyl'
import { expect } from 'vitest'
import { resolve as resolvePath } from '../scripts/utils'

/**
 * Create fake file creator
 *
 * @param fixture - fixture file path
 * @returns fake file creator
 */
export function createFakeFileCreator(fixture: string) {
  const filePath = resolvePath(fixture)
  const fileContent = fs.readFileSync(filePath)
  return () =>
    new File({
      path: filePath,
      contents: fileContent,
    })
}

export function toStream(contents: Buffer, chunkSize?: number): Transform {
  const stream = through()

  if (chunkSize && chunkSize > 0) {
    for (let index = 0; index < contents.length; index += chunkSize) {
      stream.write(contents.subarray(index, index + chunkSize))
    }
  } else {
    stream.write(contents)
  }

  stream.end()
  return stream
}

export type CreateFileOptions = ConstructorParameters<typeof File>[0]
/**
 * Create file
 *
 * @param options - options
 * @returns file
 */
export function createFile(options: CreateFileOptions = {}) {
  return new File(options)
}

/**
 * Gulp plugin options
 */
// oxlint-disable-next-line typescript/no-explicit-any
type PluginOptions = Record<PropertyKey, any>

/**
 * Stream creator
 */
export type StreamCreator<T extends PluginOptions> = (options?: T) => Transform

export interface TestOptions<T extends PluginOptions, F extends File> {
  file: F
  pluginOptions?: T
  streamCreator: StreamCreator<T>
  streamChunkSize?: number
}

export function testTransformFile<T extends PluginOptions, F extends File>(
  options: TestOptions<T, F>,
) {
  return new Promise<void>((resolve, reject) => {
    const stream = options.streamCreator(options.pluginOptions)

    stream.on('error', reject)
    stream.on('data', (file: File) => {
      if (options.file.isNull()) {
        expect(file.isNull()).toBeTruthy()
      } else {
        expect(file).toBeDefined()
        expect(file.isBuffer()).toBeTruthy()
        expect(file.contents?.toString().trim()).toMatchSnapshot()
      }
      resolve()
    })
    stream.end(options.file)
  })
}

export function testTransformStream<
  T extends PluginOptions,
  F extends File.BufferFile,
>(options: TestOptions<T, F>) {
  return new Promise<void>((resolve, reject) => {
    const fixture = createFile({
      contents: toStream(options.file.contents, options.streamChunkSize),
    })
    const stream = options.streamCreator(options.pluginOptions)
    let emittedFiles = 0

    stream.on('error', reject)
    stream.on('data', (file: File.StreamFile) => {
      emittedFiles += 1
      expect(emittedFiles).toBe(1)
      expect(file).toBeDefined()
      expect(file.isStream()).toBeTruthy()
      const chunks: Buffer[] = []

      file.contents.on('error', reject)
      file.contents.on('data', (data: Buffer | string) => {
        chunks.push(Buffer.isBuffer(data) ? data : Buffer.from(data))
      })
      file.contents.on('end', () => {
        expect(Buffer.concat(chunks).toString().trim()).toMatchSnapshot()
        resolve()
      })
    })
    stream.end(fixture)
  })
}
