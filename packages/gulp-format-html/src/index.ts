import type { Transform } from 'stream'
import through from 'through2'
import PluginError from 'plugin-error'
import jsBeautify from 'js-beautify'
import { createLogger } from '@ntnyq/logger'
import type File from 'vinyl'
import type { TransformCallback } from 'through2'
import type { HTMLBeautifyOptions } from 'js-beautify'

export interface Options extends HTMLBeautifyOptions {
  /**
   * Display name of file from stream that is being formatting.
   */
  verbose?: boolean
}

type FormatableContents = Buffer | NodeJS.ReadableStream | null

const PLUGIN_NAME = 'gulp-format-html'
const DEFAULT_OPTIONS = {
  indent_size: 2,
  inline: [],
  content_unformatted: ['pre', 'textarea', 'script'],
}
const logger = createLogger({ time: 'HH:mm:ss' })
// Fix import html in esm
const beautifyHtml = jsBeautify.html

/**
 * format HTML via `js-beautify`
 * @param options format options `Options`
 * @returns formatted HTML
 */
export const formatHTML = (options: Options = {}): Transform => {
  options = Object.assign({}, DEFAULT_OPTIONS, options)

  return through.obj((file: File, enc, next) => {
    if (file.isNull()) return next(null, file)

    const beautify = (buf: FormatableContents, _: unknown, cb: TransformCallback): void => {
      try {
        const contents = Buffer.from(beautifyHtml(buf?.toString() ?? '', options))

        if (next === cb) {
          file.contents = contents
          return cb(null, file)
        }

        cb(null, contents)
        next(null, file)
      } catch (err: unknown) {
        const opts = Object.assign({}, options, { fileName: file.path })
        const error = new PluginError(PLUGIN_NAME, err as Error, opts)

        if (next !== cb) {
          return next(error)
        }

        cb(error)
      }
    }

    if (file.isStream()) {
      file.contents = file.contents.pipe(through(beautify))
    } else {
      if (options.verbose) {
        logger.info(`${PLUGIN_NAME} is formatting file: ${file.path}`)
      }

      beautify(file.contents, null, next)
    }
  })
}

export default formatHTML
