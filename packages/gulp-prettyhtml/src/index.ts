import type { Transform } from 'stream'
import through from 'through2'
import PluginError from 'plugin-error'
import prettyHtml from '@starptech/prettyhtml'
import { createLogger } from '@ntnyq/logger'
import type File from 'vinyl'
import type { TransformCallback } from 'through2'

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

const PLUGIN_NAME = `gulp-prettyhtml`
const logger = createLogger({
  time: `HH:mm:ss`,
})

const GulpPrettyHtml = (options: Options = {}): Transform => {
  return through.obj((file: File, enc, next) => {
    if (file.isNull()) return next(null, file)

    const pretty = (buf: FormatableContents, _: unknown, cb: TransformCallback): void => {
      try {
        const contents = Buffer.from(prettyHtml(buf?.toString() ?? ``, options).contents)

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
      file.contents = file.contents.pipe(through(pretty))
    } else {
      if (options.verbose) {
        logger.info(`${PLUGIN_NAME} is formatting file: ${file.path}`)
      }

      pretty(file.contents, null, next)
    }
  })
}

export default GulpPrettyHtml
