import { basename, resolve } from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'
import fg from 'fast-glob'

// fix cjs exports
const files = await fg(`*.js`, {
  ignore: [`chunk-*`],
  absolute: true,
  cwd: resolve(process.cwd(), `dist`),
})
for (const file of files) {
  console.log(`[postbuild]`, basename(file))
  let code = await readFile(file, `utf8`)
  code = code.replace(`exports.default =`, `module.exports =`)
  code += `exports.default = module.exports;`
  await writeFile(file, code)
}
