import { Transform } from 'stream'

/**
 * Returns a stream that compiles Vinyl files as HTML
 */
declare function GulpDiffableHtml (options: GulpDiffableHtml.Options): Transform;

declare namespace GulpDiffableHtml {
  interface Options {
    /**
     * Display name of file from stream that is being formatting
     */
    verbose?: boolean;
  }
}

export = GulpDiffableHtml
