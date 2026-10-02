import { Buffer } from 'node:buffer'
import path from 'node:path'
import process from 'node:process'
import type { Transform, TransformCallback } from 'node:stream'
import { c, createLogger } from '@ntnyq/logger'
import { minifySync } from 'oxc-minify'
import type { MinifyOptions } from 'oxc-minify'
import PluginError from 'plugin-error'
import through from 'through2'
import type Vinyl from 'vinyl'

export interface Options extends MinifyOptions {
  /**
   * Displat the filename that is being minifying
   *
   * @default false
   */
  verbose?: boolean
}

type TransformableContent = Buffer | null

const rootDir = process.cwd()
const PLUGIN_NAME = 'gulp-oxc-minify'
const DUMMY_FILENAME = 'dummy.ts'
const DEFAULT_OPTIONS: Options = {}

const logger = createLogger({ time: 'HH:mm:ss' })

export const oxcMinify = (options: Options = {}): Transform => {
  options = { ...DEFAULT_OPTIONS, ...options }

  return through.obj((file: Vinyl, _enc: unknown, next: TransformCallback) => {
    if (file.isNull()) {
      return next(null, file)
    }

    const streamInput = file.isStream()

    function transform(
      buffer: TransformableContent,
      _: unknown,
      cb: TransformCallback,
    ) {
      try {
        const minifyResult = minifySync(
          file.isStream() ? DUMMY_FILENAME : file.path,
          buffer?.toString() ?? '',
          options,
        )
        const contents = Buffer.from(minifyResult.code)

        if (streamInput) {
          const outputStream = through()
          outputStream.end(contents)
          file.contents = outputStream
        } else {
          file.contents = contents
        }
        return cb(null, file)
      } catch (error: unknown) {
        const errorOptions = { ...options, fileName: file.path }
        const pluginError = new PluginError(
          PLUGIN_NAME,
          error as Error,
          errorOptions,
        )
        return cb(pluginError)
      }
    }

    if (streamInput) {
      const chunks: Buffer[] = []

      if (options.verbose) {
        logger.info(
          `${c.yellow(PLUGIN_NAME)}: ${c.green(path.relative(rootDir, file.path))}`,
        )
      }

      file.contents.on('error', error => {
        next(
          new PluginError(PLUGIN_NAME, error as Error, { fileName: file.path }),
        )
      })
      file.contents.on('data', (chunk: Buffer | string) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      })
      file.contents.on('end', () => {
        transform(Buffer.concat(chunks), null, next)
      })
    } else {
      if (options.verbose) {
        logger.info(
          `${c.yellow(PLUGIN_NAME)}: ${c.green(path.relative(rootDir, file.path))}`,
        )
      }

      transform(file.contents as Buffer, null, next)
    }
  })
}

export default oxcMinify
