const { copyFileSync, readdirSync, statSync } = require('fs')
const { resolve } = require('path')

const config = {
  dir: resolve(__dirname, '../src'),
  outDir: resolve(__dirname, '../../.ecc/faas'),
}

main()

async function main() {
  copyFileSync(resolve(__dirname, '../package.json'), resolve(config.outDir, 'package.json'))
}
