import process from 'node:process'
import { relative } from 'node:path'
import { Buffer } from 'node:buffer'
import through from 'through2'
// @ts-expect-error no-types`
import toDiffableHtml from 'diffable-html'
import PluginError from 'plugin-error'
import { c, createLogger } from '@ntnyq/logger'
import type { Transform } from 'node:stream'
import type File from 'vinyl'
import type { TransformCallback } from 'through2'

export interface Options {
  /**
   * custom sort attributes
   * @default `names => names`
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
 * @param options format options `Options`
 * @returns formatted HTML
 */
export const diffableHTML = (options: Options = {}): Transform =>
  through.obj((file: File, enc, next) => {
    if (file.isNull()) return next(null, file)

    const diffable = (buf: DiffableContents, _: unknown, cb: TransformCallback): void => {
      try {
        const contents = Buffer.from(toDiffableHtml(buf?.toString() ?? '', options))

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
        logger.info(`${c.yellow(PLUGIN_NAME)}: ${c.green(relative(rootDir, file.path))}`)
      }

      diffable(file.contents, null, next)
    }
  })

export default diffableHTML
