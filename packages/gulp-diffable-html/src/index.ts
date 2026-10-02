import { Buffer } from 'node:buffer'
import path from 'node:path'
import process from 'node:process'
import type { Transform, TransformCallback } from 'node:stream'
import { c, createLogger } from '@ntnyq/logger'
import toDiffableHtml from 'diffable-html'
import PluginError from 'plugin-error'
import through from 'through2'
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

type DiffableContents = Buffer | null

/**
 * format HTML via `diffable-html`
 * @param options - format options `Options`
 * @returns formatted HTML
 */
export const diffableHTML = (options: Options = {}): Transform =>
  through.obj((file: Vinyl, _enc: unknown, next: TransformCallback) => {
    if (file.isNull()) {
      return next(null, file)
    }

    const streamInput = file.isStream()

    function transform(
      buffer: DiffableContents,
      _: unknown,
      cb: TransformCallback,
    ) {
      try {
        const contents = Buffer.from(
          toDiffableHtml(buffer?.toString() ?? '', options),
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
        const errorOptions = { fileName: file.path }
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

export default diffableHTML
