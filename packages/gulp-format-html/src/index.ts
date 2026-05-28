import { Buffer } from 'node:buffer'
import path from 'node:path'
import process from 'node:process'
import type { Transform, TransformCallback } from 'node:stream'
import { c, createLogger } from '@ntnyq/logger'
import jsBeautify from 'js-beautify'
import type { HTMLBeautifyOptions } from 'js-beautify'
import PluginError from 'plugin-error'
import through from 'through2'
import type Vinyl from 'vinyl'

export interface Options extends HTMLBeautifyOptions {
  /**
   * Display name of file from stream that is being formatting.
   */
  verbose?: boolean
}

type FormatableContents = Buffer | null

const rootDir = process.cwd()
const PLUGIN_NAME = 'gulp-format-html'
const DEFAULT_OPTIONS: HTMLBeautifyOptions = {
  indent_size: 2,
  inline: [],
  content_unformatted: ['pre', 'textarea', 'script'],
}
const logger = createLogger({ time: 'HH:mm:ss' })
// Fix import html in esm
const beautifyHtml = jsBeautify.html

/**
 * format HTML via `js-beautify`
 * @param options - format options `Options`
 * @returns formatted HTML
 */
export const formatHTML = (options: Options = {}): Transform => {
  options = { ...DEFAULT_OPTIONS, ...options }

  return through.obj((file: Vinyl, _enc: unknown, next: TransformCallback) => {
    if (file.isNull()) {
      return next(null, file)
    }

    const streamInput = file.isStream()

    function transform(
      buffer: FormatableContents,
      _: unknown,
      cb: TransformCallback,
    ) {
      try {
        const contents = Buffer.from(
          beautifyHtml(buffer?.toString() ?? '', options),
        )

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

export default formatHTML
