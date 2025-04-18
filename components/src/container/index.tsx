import { EasyCoderElement } from '@easy-coder/sdk/store'
import { require } from '@easy-coder/sdk/helper'

interface RequireCb {
  (context: Record<string, any>): any
}

const vChartPath = 'https://unpkg.com/@visactor/vchart@1.13.8/build/index.min.js'
require.addStartStore({
  '@visactor/vchart': new Promise(async (resolve) => {
    const script = document.createElement('script')
    const response = await fetch(vChartPath)
    const code = await response.text()
    const fnKey = `fn_${new Date().getTime()}_${Math.floor(Math.random() * 10000)}`

    ;(window as any).requireCustom = {
      [fnKey]: (deps: string[], cb: RequireCb) => {
        const context = {}
        cb(context)
        resolve(context)
        script.remove()
        delete (window as any).requireCustom[fnKey]
      },
    }

    script.innerText = `(function() {const define = window.requireCustom.${fnKey};define.amd=true;${code}})()`.replace(/\n/g, '')

    document.body.appendChild(script)
  }),
})

export interface Props extends EasyCoderElement.DataProps {
  style?: React.CSSProperties
  className?: string
  children?: () => React.ReactNode
}

export default function Container({ children, ...extra }: Props) {
  return <div {...extra}>{children?.()}</div>
}

// 直方图、区间柱图、箱型图、饼图、玫瑰图、漏斗图、雷达图、词云、仪表盘、进度图
