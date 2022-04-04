import { Transform } from 'stream'
import through, { TransformCallback } from 'through2'
import PluginError from 'plugin-error'
import { html as beautifyHtml, HTMLBeautifyOptions } from 'js-beautify'
import log from 'fancy-log'
import File from 'vinyl'

interface GulpFormatHtmlOptions extends HTMLBeautifyOptions {
  /**
   * Display name of file from stream that is being formatting.
   */
   verbose?: boolean
}

type DiffableContents = Buffer | NodeJS.ReadableStream | null

const PLUGIN_NAME = 'gulp-format-html'
const DEFAULT_OPTIONS = {
  indent_size: 2,
  inline: [],
  content_unformatted: ['pre', 'textarea', 'script'],
}

const GulpFormatHtml = (options: GulpFormatHtmlOptions = {}): Transform => {
  options = Object.assign({}, DEFAULT_OPTIONS, options)

  return through.obj(function (file: File, enc, next) {
    if (file.isNull()) return next(null, file)

    const beautify = (buf:DiffableContents, _: unknown, cb:TransformCallback):void => {
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
        log(`${PLUGIN_NAME} is formatting file:`, file.path)
      }

      beautify(file.contents, null, next)
    }
  })
}

export = GulpFormatHtml
