import type { Transform } from 'stream'
import through from 'through2'
import toDiffableHtml from 'diffable-html'
import PluginError from 'plugin-error'
import { createLogger } from '@ntnyq/logger'
import type { TransformCallback } from 'through2'
import type File from 'vinyl'

interface GulpDiffableHtmlOptions {
  verbose?: boolean
}

const PLUGIN_NAME = `gulp-diffable-html`
const logger = createLogger({
  time: `HH:mm:ss`,
})

type DiffableContents = Buffer | NodeJS.ReadableStream | null

const GulpDiffableHtml = (options: GulpDiffableHtmlOptions = {}): Transform =>
  through.obj((file: File, enc, next) => {
    if (file.isNull()) return next(null, file)

    const diffable = (
      buf: DiffableContents,
      _: unknown,
      cb: TransformCallback,
    ): void => {
      try {
        const contents = Buffer.from(toDiffableHtml(buf?.toString(), options))

        if (next === cb) {
          file.contents = contents
          return cb(null, file)
        }

        cb(null, contents)
        next(null, file)
      } catch (err: unknown) {
        const opts = Object.assign({}, { fileName: file.path })
        const error = new PluginError(PLUGIN_NAME, err as Error, opts)

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
        logger.info(`${PLUGIN_NAME} is formmating file: ${file.path}`)
      }

      diffable(file.contents, null, next)
    }
  })

export = GulpDiffableHtml
