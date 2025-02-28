import fs from 'node:fs'
import through from 'through2'
import File from 'vinyl'
import { expect } from 'vitest'
import { resolve } from '../scripts/utils'
import type { Buffer } from 'node:buffer'
import type { Transform } from 'node:stream'

/**
 * Create fake file creator
 *
 * @param fixture - fixture file path
 * @returns fake file creator
 */
export function createFakeFileCreator(fixture: string) {
  const filePath = resolve(fixture)
  const fileContent = fs.readFileSync(filePath)
  return () =>
    new File({
      path: filePath,
      contents: fileContent,
    })
}

export function toStream(contents: Buffer): Transform {
  const stream = through()
  stream.write(contents)
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
type PluginOptions = Record<PropertyKey, any>

/**
 * Stream creator
 */
export type StreamCreator<T extends PluginOptions> = (options?: T) => Transform

export interface TestOptions<T extends PluginOptions, F extends File> {
  file: F
  pluginOptions?: T
  streamCreator: StreamCreator<T>
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
    stream.write(options.file)
  })
}

export function testTransformStream<
  T extends PluginOptions,
  F extends File.BufferFile,
>(options: TestOptions<T, F>) {
  return new Promise<void>((resolve, reject) => {
    const fixture = createFile({ contents: toStream(options.file.contents) })
    const stream = options.streamCreator(options.pluginOptions)
    stream.on('error', reject)
    stream.on('data', (file: File.StreamFile) => {
      expect(file).toBeDefined()
      expect(file.isStream()).toBeTruthy()
      file.contents.on('data', (data: Buffer) => {
        expect(data.toString().trim()).toMatchSnapshot()
        resolve()
      })
    })
    stream.write(fixture)
  })
}
