# Copilot Instructions for gulp-plugins

## Project Architecture

This is a **pnpm monorepo** containing multiple Gulp plugins that follow a consistent architecture pattern. Each plugin transforms files via through2 streams and handles both buffer and stream modes.

### Core Plugin Pattern

All plugins follow this established pattern (see `packages/gulp-*/src/index.ts`):

```typescript
export const pluginName = (options: Options = {}): Transform => {
  return through.obj((file: Vinyl, _enc, next) => {
    if (file.isNull()) return next(null, file)

    function transform(
      buffer: Buffer | NodeJS.ReadableStream | null,
      _: unknown,
      cb: TransformCallback,
    ) {
      try {
        // Process content
        const contents = Buffer.from(processedContent)

        // Critical dual-mode callback pattern:
        if (next === cb) {
          // Buffer mode
          file.contents = contents
          return cb(null, file)
        }

        // Stream mode - call BOTH callbacks
        cb(null, contents)
        next(null, file)
      } catch (err) {
        const error = new PluginError(PLUGIN_NAME, err, { fileName: file.path })
        return next !== cb ? next(error) : cb(error)
      }
    }

    if (file.isStream()) {
      file.contents = file.contents.pipe(through(transform))
    } else {
      transform(file.contents, null, next)
    }
  })
}
```

**Critical**: The `cb(null, contents); next(null, file)` pattern is intentional for stream processing - it's NOT a "callback called multiple times" bug.

### Package Structure

Each package follows identical structure:

- `src/index.ts` - Main plugin implementation with dual exports
- `tsdown.config.ts` - Build configuration (ESM/CJS, Node 18+)
- `package.json` - Dual exports, dependencies from workspace catalog
- Tests in `tests/[package-name]/` with fixtures and snapshots

### Development Commands

```bash
# Install deps (uses pnpm workspace catalog)
pnpm install

# Run all package tests
pnpm test

# Build all packages
pnpm run build

# Watch mode for development
pnpm -r run dev

# Lint/typecheck
pnpm run lint
pnpm run typecheck
```

### Testing Patterns

Use established test utilities from `tests/utils.ts`:

```typescript
// Test both buffer and stream modes
function runTests(streamCreator: StreamCreator<Options>) {
  describe('file', () => {
    it('Should ignore empty file', () =>
      testTransformFile({ streamCreator, file: createFile() }))

    it('Should process files', () =>
      testTransformFile({ streamCreator, file: createFakeFile() }))
  })

  describe('stream', () => {
    it('Should process streams', () =>
      testTransformStream({ streamCreator, file: createFakeFile() }))
  })
}
```

### Key Conventions

- **Error Handling**: Always use `PluginError` with `fileName: file.path`
- **Logging**: Use `@ntnyq/logger` with consistent format: `${c.yellow(PLUGIN_NAME)}: ${c.green(relative(rootDir, file.path))}`
- **Options**: Extend base library options, add `verbose?: boolean`
- **Exports**: Both named and default exports for each plugin
- **Dependencies**: Use workspace catalog for shared deps (`through2`, `vinyl`, etc.)

### Release Workflow

Uses Changesets for version management:

```bash
# Add changeset
npx changeset

# Version and publish (CI handles this)
pnpm run publish
```

### Common Issues

1. **Stream vs Buffer**: Test both modes - streams use nested transform callbacks
2. **Callback Pattern**: Don't "fix" the dual callback calls in stream mode
3. **Type Imports**: Use `type` imports for TypeScript types consistently
4. **Node Imports**: Use `node:` prefix for built-in modules
