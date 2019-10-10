import { Transform } from 'stream'

/**
 * Returns a stream that compiles Vinyl files as HTML
 */
declare function GulpFormatHtml (options: GulpFormatHtml.Options): Transform;

declare namespace GulpFormatHtml {
  type TypeBraceStyle = 'collapse-preserve-inline' | 'collapse' | 'expand' | 'end-expand' | 'none'

  type TypeIndentScripts = 'keep' | 'separate' | 'normal'

  type TypeWrapAttributes = 'auto' | 'force' | 'force-expand-multiline' | 'force-aligned' | 'aligned-multiple' | 'preserve' | 'preserve-aligned'

  // See https://github.com/beautify-web/js-beautify/blob/v1.10.2/js/src/html/options.js
  interface HTMLBeautifyOptions {
    indent_size?: number;
    indent_char?: string;
    indent_with_tabs?: boolean;
    eol?: string;
    end_with_newline?: boolean;
    preserve_newlines?: boolean;
    max_preserve_newlines?: number;
    indent_inner_html?: boolean;
    brace_style?: TypeBraceStyle;
    indent_scripts?: TypeIndentScripts;
    wrap_line_length?: number;
    indent_handlebars?: boolean;
    wrap_attributes?: TypeWrapAttributes;
    wrap_attributes_indent_size?: number;
    unformatted?: string[];
    content_unformatted?: string[];
    extra_liners?: string[];
    editorconfig?: boolean;
    inline?: string[];
    unformatted_content_delimiter?: string;
    indent_empty_lines?: boolean;
    templating?: string[];
  }

  interface Options extends HTMLBeautifyOptions {
    /**
     * Display name of file from stream that is being formatting.
     */
    verbose?: boolean;
  }
}

export = GulpFormatHtml
