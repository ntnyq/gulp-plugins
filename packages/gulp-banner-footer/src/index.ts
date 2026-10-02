import { Buffer } from 'node:buffer'
import path from 'node:path'
import process from 'node:process'
import type { Transform, TransformCallback } from 'node:stream'
import { c, createLogger } from '@ntnyq/logger'
import PluginError from 'plugin-error'
import through from 'through2'
import type Vinyl from 'vinyl'

export interface Options {
  /**
   * banner content
   */
  banner?: string | ((file: Vinyl) => string | undefined)

  /**
   * footer content
   */
  footer?: string | ((file: Vinyl) => string | undefined)

  /**
   * Display file name is being processing
   *
   * @default false
   */
  verbose?: boolean
}

const rootDir = process.cwd()
const PLUGIN_NAME = 'gulp-banner-footer'
const logger = createLogger({ time: 'HH:mm:ss' })

export const addBannerOrFooter = (options: Options = {}): Transform => {
  function transform(file: Vinyl, _: unknown, cb: TransformCallback) {
    if (file.isNull()) {
      return cb(null, file)
    }

    if (file.isStream()) {
      const errorOptions = { fileName: file.path }
      const error = new PluginError(
        PLUGIN_NAME,
        new Error('Streaming not supported'),
        errorOptions,
      )
      return cb(error)
    }

    if (options.verbose) {
      logger.info(
        `${c.yellow(PLUGIN_NAME)}: ${c.green(path.relative(rootDir, file.path))}`,
      )
    }

    const banner =
      typeof options.banner === 'function'
        ? options.banner(file)
        : options.banner
    const footer =
      typeof options.footer === 'function'
        ? options.footer(file)
        : options.footer
    // oxlint-disable-next-line no-undefined
    const hasBanner = banner !== null && banner !== undefined
    // oxlint-disable-next-line no-undefined
    const hasFooter = footer !== null && footer !== undefined

    if (!hasBanner && !hasFooter) {
      return cb(null, file)
    }

    const parts: string[] = []
    if (hasBanner) {
      parts.push(banner)
    }
    parts.push(file.contents?.toString() ?? '')
    if (hasFooter) {
      parts.push(footer)
    }

    const contents = Buffer.from(parts.join('\n'))

    file.contents = contents

    return cb(null, file)
  }

  return through.obj(transform)
}

export default addBannerOrFooter
