import { Buffer } from 'node:buffer'
import { relative } from 'node:path'
import process from 'node:process'
import { c, createLogger } from '@ntnyq/logger'
import jsBeautify from 'js-beautify'
import PluginError from 'plugin-error'
import through from 'through2'
import type { Transform } from 'node:stream'
import type { HTMLBeautifyOptions } from 'js-beautify'
import type { TransformCallback } from 'through2'
import type Vinyl from 'vinyl'

export interface Options extends HTMLBeautifyOptions {
  /**
   * Display name of file from stream that is being formatting.
   */
  verbose?: boolean
}

type FormatableContents = Buffer | NodeJS.ReadableStream | null

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
  options = Object.assign({}, DEFAULT_OPTIONS, options)

  return through.obj((file: Vinyl, _enc, next) => {
    if (file.isNull()) return next(null, file)

    function transform(
      buffer: FormatableContents,
      _: unknown,
      cb: TransformCallback,
    ) {
      try {
        const contents = Buffer.from(
          beautifyHtml(buffer?.toString() ?? '', options),
        )

        if (next === cb) {
          file.contents = contents
          return cb(null, file)
        }

        cb(null, contents)
        next(null, file)
      } catch (err: unknown) {
        const errorOptions = Object.assign({}, options, { fileName: file.path })
        const error = new PluginError(PLUGIN_NAME, err as Error, errorOptions)

        if (next !== cb) {
          return next(error)
        }

        cb(error)
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

export default formatHTML
