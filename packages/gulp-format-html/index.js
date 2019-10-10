'use strict'

const PluginError = require('plugin-error')
const through = require('through2')
const log = require('fancy-log')
const beautifyHtml = require('js-beautify').html

const PLUGIN_NAME = 'gulp-format-html'
const DEFAULT_OPTIONS = {
  indent_size: 2,
  inline: [],
  content_unformatted: ['pre', 'textarea', 'script'],
}

module.exports = function (options = {}) {
  options = Object.assign({}, DEFAULT_OPTIONS, options)

  return through.obj(function (file, enc, next) {
    if (file.isNull()) return next(null, file)

    const beautify = (buf, _, cb) => {
      try {
        const contents = Buffer.from(beautifyHtml(buf.toString(), options))

        if (next === cb) {
          file.contents = contents
          return cb(null, file)
        }

        cb(null, contents)
        next(null, file)
      } catch (err) {
        const opts = Object.assign({}, options, { fileName: file.path })
        const error = new PluginError(PLUGIN_NAME, err, opts)

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
