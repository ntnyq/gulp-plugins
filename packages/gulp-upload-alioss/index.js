'use strict'

const path = require('path')
const through = require('through2')
const log = require('fancy-log')
const colors = require('ansi-colors')
const Q = require('q')
const AliOSS = require('ali-oss')
const PluginError = require('plugin-error')

const PLUGIN_NAME = 'gulp-upload-alioss'

module.exports = function (options = {}) {
  const {
    accessKeyId,
    accessKeySecret,
    bucket,
    region,
    prefix = '',
    maxSize,
  } = options

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file)

      return cb()
    }

    if (file.isDirectory()) {
      return cb()
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'))
      return cb()
    }

    if (maxSize && file.contents.length > maxSize) {
      log(`${PLUGIN_NAME}: ${colors.red(`${file.path}\t${file.contents.lengthy}`)}`)
      return cb()
    }

    const getFileKey = () => path.relative(prefix, file.path)

    const uploadFile = fileKey => {
      const oss = AliOSS({
        accessKeyId,
        accessKeySecret,
        bucket,
        region,
      })

      oss.put(fileKey, file.path)
        .then(res => {
          log(`${PLUGIN_NAME}: ${colors.green(`${fileKey} upload done!`)}`)
        })
        .catch(err => {
          log(`${PLUGIN_NAME}: ${colors.red(`${fileKey} upload failed. ${err.code}`)}`)
        })
    }

    Q.fcall(getFileKey).then(uploadFile)

    this.push(file)

    return cb()
  })
}
