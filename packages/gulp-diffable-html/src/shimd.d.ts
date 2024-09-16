declare module 'diffable-html' {
  export interface Options {
    sortAttributes?: (names: string[]) => string[]
  }
  export default function toDiffableHtml(html: string, options?: Options): string
}
