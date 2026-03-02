import { Buffer } from 'node:buffer'
import { relative } from 'node:path'
import process from 'node:process'
import type { Transform } from 'node:stream'
import { c, createLogger } from '@ntnyq/logger'
import prettyHtml from '@starptech/prettyhtml'
import PluginError from 'plugin-error'
import through from 'through2'
import type { TransformCallback } from 'through2'
import type Vinyl from 'vinyl'

interface Prettier {
  tabWidth?: number
  useTabs?: boolean
  printWidth?: number
  singleQuote?: boolean
}

export interface Options {
  // https://github.com/Prettyhtml/prettyhtml/blob/master/packages/prettyhtml/index.d.ts
  tabWidth?: number
  useTabs?: boolean
  printWidth?: number
  usePrettier?: boolean
  singleQuote?: boolean
  wrapAttributes?: boolean
  sortAttributes?: boolean
  prettier?: Prettier

  /**
   * Display name of file from stream that is being formatting.
   */
  verbose?: boolean
}

type FormatableContents = Buffer | NodeJS.ReadableStream | null

const rootDir = process.cwd()
const PLUGIN_NAME = 'gulp-prettyhtml'
const logger = createLogger({ time: 'HH:mm:ss' })

/**
 * format HTML via `@starptech/prettyhtml`
 * @param options - format options `Options`
 * @returns formatted HTML
 */
export const prettyHTML = (options: Options = {}): Transform =>
  through.obj((file: Vinyl, _enc, next) => {
    if (file.isNull()) {
      return next(null, file)
    }

    function transform(
      buffer: FormatableContents,
      _: unknown,
      cb: TransformCallback,
    ) {
      try {
        const contents = Buffer.from(
          prettyHtml(buffer?.toString() ?? '', options).contents,
        )

        if (next === cb) {
          file.contents = contents
          return cb(null, file)
        }

        cb(null, contents)
        next(null, file)
      } catch (error: unknown) {
        const errorOptions = { ...options, fileName: file.path }
        const pluginError = new PluginError(
          PLUGIN_NAME,
          error as Error,
          errorOptions,
        )

        if (next !== cb) {
          return next(pluginError)
        }

        cb(pluginError)
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

export default prettyHTML
