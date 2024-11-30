import fs from 'node:fs'
import through from 'through2'
import File from 'vinyl'
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
 * Stream creator
 */
export type StreamCreator<T extends Record<PropertyKey, any>> = (options?: T) => Transform
