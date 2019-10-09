'use strict'

const through = require('through2')
const toDiffableHtml = require('diffable-html')
const PluginError = require('plugin-error')
const log = require('fancy-log')

const PLUGIN_NAME = 'gulp-diffable-html'

module.exports = function (options = {}) {
  return through.obj(function (file, enc, next) {
    if (file.isNull()) return next(null, file)

    const diffable = (buf, _, cb) => {
      try {
        const contents = Buffer.from(toDiffableHtml(buf.toString()))

        if (next === cb) {
          file.contents = contents
          return cb(null, file)
        }

        cb(null, contents)
        next(null, file)
      } catch (err) {
        const opts = Object.assign({}, { fileName: file.path })
        const error = new PluginError(PLUGIN_NAME, err, opts)

        if (next !== cb) {
          return next(error)
        }

        cb(error)
      }
    }

    if (file.isStream()) {
      file.contents = file.contents.pipe(through(diffable))
    } else {
      if (options.verbose) {
        log(`${PLUGIN_NAME} is formmating file:`, file.path)
      }

      diffable(file.contents, null, next)
    }
  })
}
