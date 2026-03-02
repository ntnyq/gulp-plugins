import { Buffer } from 'node:buffer'
import { relative } from 'node:path'
import process from 'node:process'
import type { Transform } from 'node:stream'
import { c, createLogger } from '@ntnyq/logger'
import { minifySync } from 'oxc-minify'
import type { MinifyOptions } from 'oxc-minify'
import PluginError from 'plugin-error'
import through from 'through2'
import type { TransformCallback } from 'through2'
import type Vinyl from 'vinyl'

export interface Options extends MinifyOptions {
  /**
   * Displat the filename that is being minifying
   *
   * @default false
   */
  verbose?: boolean
}

type TransformableContent = Buffer | NodeJS.ReadableStream | null

const rootDir = process.cwd()
const PLUGIN_NAME = 'gulp-oxc-minify'
const DUMMY_FILENAME = 'dummy.ts'
const DEFAULT_OPTIONS: Options = {}

const logger = createLogger({ time: 'HH:mm:ss' })

export const oxcMinify = (options: Options = {}): Transform => {
  options = { ...DEFAULT_OPTIONS, ...options }

  return through.obj((file: Vinyl, _enc, next) => {
    if (file.isNull()) {
      return next(null, file)
    }

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

        if (next === cb) {
          file.contents = contents
          return cb(null, file)
        }

        cb(null, contents)
        next(null, file)
      } catch (error: unknown) {
        const errorOptions = { ...options, fileName: file.path }
        const pluginError = new PluginError(
          PLUGIN_NAME,
          error as Error,
          errorOptions,
        )

        if (next !== cb) {
          return next(pluginError)
        }

        cb(pluginError)
      }
    }

    if (file.isStream()) {
      file.contents = file.contents.pipe(through(transform))
    } else {
      if (options.verbose) {
        logger.info(
          `${c.yellow(PLUGIN_NAME)}: ${c.green(relative(rootDir, file.path))}`,
        )
      }

      transform(file.contents, null, next)
    }
  })
}

export default oxcMinify
