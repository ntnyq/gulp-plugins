import { Buffer } from 'node:buffer'
import { relative } from 'node:path'
import process from 'node:process'
import { c, createLogger } from '@ntnyq/logger'
import toDiffableHtml from 'diffable-html'
import PluginError from 'plugin-error'
import through from 'through2'
import type { Transform } from 'node:stream'
import type { TransformCallback } from 'through2'
import type Vinyl from 'vinyl'

export interface Options {
  /**
   * custom sort attributes
   */
  sortAttributes?: (names: string[]) => string[]

  /**
   * Display name of file from stream that is being formatting
   *
   * @default false
   */
  verbose?: boolean
}

const rootDir = process.cwd()
const PLUGIN_NAME = 'gulp-diffable-html'
const logger = createLogger({ time: 'HH:mm:ss' })

type DiffableContents = Buffer | NodeJS.ReadableStream | null

/**
 * format HTML via `diffable-html`
 * @param options - format options `Options`
 * @returns formatted HTML
 */
export const diffableHTML = (options: Options = {}): Transform =>
  through.obj((file: Vinyl, _enc, next) => {
    if (file.isNull()) return next(null, file)

    function transform(buffer: DiffableContents, _: unknown, cb: TransformCallback) {
      try {
        const contents = Buffer.from(toDiffableHtml(buffer?.toString() ?? '', options))

        if (next === cb) {
          file.contents = contents
          return cb(null, file)
        }

        cb(null, contents)
        next(null, file)
      } catch (err: unknown) {
        const errorOptions = Object.assign({}, { fileName: file.path })
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
        logger.info(`${c.yellow(PLUGIN_NAME)}: ${c.green(relative(rootDir, file.path))}`)
      }

      transform(file.contents, null, next)
    }
  })

export default diffableHTML
