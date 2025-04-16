module.exports = function extractToEntry() {
  return {
    name: 'extract-to-entry',

    generateBundle: function (options, bundle) {
      if (options.format === 'es') {
        const styleFiles = []
        const jsFiles = []

        Object.keys(bundle).forEach((fileName) => {
          if (/.*\.m?js$/.test(fileName)) {
            jsFiles.push(fileName)
          } else if (/.*\.css$/.test(fileName)) {
            styleFiles.push(fileName)
          }
        })
        if (!styleFiles.length || !jsFiles.length) return

        const importStyle = styleFiles.map((item) => `import './${item}';`).join('\n')
        jsFiles.forEach((fileName) => {
          const code = bundle[fileName].code
          if (code) {
            bundle[fileName].code = `${importStyle}\n${code}`
          }
        })
      } else if (options.format === 'umd') {
        const jsFiles = []
        const styleFiles = []

        Object.keys(bundle).forEach((fileName) => {
          if (/.*\.m?js$/.test(fileName)) {
            jsFiles.push(fileName)
          } else if (/.*\.css$/.test(fileName)) {
            styleFiles.push(fileName)
          }
        })
        if (!jsFiles.length || !styleFiles.length) return

        const importStyleList = styleFiles.map((name) => {
          return `(function(){var styleDom=document.createElement("style");styleDom.textContent=\`${bundle[name].source}\`;document.head.appendChild(styleDom)})();`
        })
        const importStyle = importStyleList.join('\n')

        jsFiles.forEach((fileName) => {
          const code = bundle[fileName].code
          if (code) {
            bundle[fileName].code = `${importStyle}\n${code}`
          }
        })
      }
    },
  }
}
