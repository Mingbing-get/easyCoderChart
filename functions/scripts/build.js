const { readdirSync, statSync, existsSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const { build } = require('vite')

const config = {
  dir: resolve(__dirname, '../src'),
  outDir: resolve(__dirname, '../../.ecc/functions'),
}

main()

async function main() {
  const dirs = getDirNames()

  const watch = process.argv.includes('-w')

  await Promise.all(
    dirs.map(async (name) => {
      await startBuild(name, watch)
    })
  )
}

async function startBuild(target, watch) {
  await build({
    build: {
      lib: {
        entry: resolve(config.dir, `./${target}/meta.ts`),
        name: 'index',
        fileName: () => 'index.js',
      },
      rollupOptions: {
        external: [/@easy-coder\/sdk\/*/],
        output: [
          {
            format: 'umd',
            name: 'index',
            assetFileNames: 'index.[ext]',
          },
        ],
      },
      outDir: resolve(config.outDir, `./${target}/`),
      watch: watch ? {} : undefined,
    },
  })
}

function getDirNames() {
  const directories = readdirSync(config.dir).filter((f) => {
    const functionDir = resolve(config.dir, f)
    return statSync(functionDir).isDirectory() && existsSync(resolve(functionDir, 'meta.ts'))
  })

  return directories
}
