const { readdirSync, statSync, existsSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const { build } = require('vite')
const react = require('@vitejs/plugin-react')
const { terser } = require('rollup-plugin-terser')
const replace = require('@rollup/plugin-replace')
const extractToEntry = require('./plugin/rollup-plugin-extract-to-entry')

const config = {
  dir: resolve(__dirname, '../src'),
  outDir: resolve(__dirname, '../../.ecc/components'),
}

main()

async function main() {
  const dirs = getDirNames()

  const watch = process.argv.includes('-w')

  await Promise.all(
    dirs.map(async (name) => {
      await startBuild(name, watch)

      const needBuildWeapp = readdirSync(`${config.dir}/${name}`).some((f) => {
        if (statSync(`${config.dir}/${name}/${f}`).isFile() && ['meta.weapp.tsx', 'meta.weapp.ts'].includes(f)) {
          return true
        }
      })

      if (needBuildWeapp) {
        await startBuildWeapp(name, watch)
      }
    })
  )
}

async function startBuild(target, watch) {
  const output = [
    {
      format: 'umd',
      name: 'index',
      assetFileNames: 'index.[ext]',
    },
  ]

  if (!watch) {
    output.push({
      format: 'esm',
      name: 'index',
      assetFileNames: 'index.[ext]',
    })
  }

  await build({
    plugins: [react()],
    build: {
      lib: {
        entry: resolve(config.dir, `./${target}/meta.ts`),
        name: 'index',
        fileName: (format) => (format === 'esm' ? 'index.esm.js' : 'index.js'),
      },
      rollupOptions: {
        external: [/@easy-coder\/sdk\/*/, 'react', /^react\/.*/, 'react-dom', '@arco-design/web-react', '@visactor/vchart'],
        output,
        plugins: [
          extractToEntry(),
          terser({
            format: {
              comments: false,
            },
          }),
          replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify('production'),
          }),
        ],
      },
      outDir: resolve(config.outDir, `./${target}/`),
      watch: watch ? {} : undefined,
    },
  })
}

async function startBuildWeapp(target, watch) {
  await build({
    plugins: [react()],
    build: {
      lib: {
        entry: resolve(config.dir, `./${target}/meta.weapp.ts`),
        name: 'index',
        fileName: () => 'index.js',
      },
      rollupOptions: {
        external: [/@easy-coder\/sdk\/*/, 'react', /^react\/.*/, 'react-dom', '@arco-design/web-react'],
        output: [
          {
            format: 'esm',
            name: 'index',
            assetFileNames: 'index.[ext]',
          },
        ],
        plugins: [
          extractToEntry(),
          terser({
            format: {
              comments: false,
            },
          }),
          replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify('production'),
          }),
        ],
      },
      outDir: resolve(config.outDir, `./${target}/weapp`),
      watch: watch ? {} : undefined,
    },
  })
}

function getDirNames() {
  const directories = readdirSync(config.dir).filter((f) => {
    const componentDir = resolve(config.dir, f)
    return statSync(componentDir).isDirectory() && existsSync(resolve(componentDir, 'meta.ts'))
  })

  return directories
}
