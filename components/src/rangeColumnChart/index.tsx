import { useEffect, useMemo, useRef } from 'react'
import { VChart, IRangeColumnChartSpec } from '@visactor/vchart'
import { Spin } from '@arco-design/web-react'
import { i18n, Multilingual } from '@easy-coder/sdk/i18n'
import { EasyCoderElement } from '@easy-coder/sdk/store'

import { DataSourceWithChart } from '../aSetter/commonPanelSetter/type'
import useChartDataList from '../aHooks/useChartDataList'
import { checkDataSourceIsComplete } from '../aUtils/dataSource'
import { rangeColumnValueFields, minX, maxX } from './config'

export interface RangeColumnChartProps extends EasyCoderElement.DataProps {
  title?: Multilingual
  dataSource?: DataSourceWithChart
  direction?: 'horizontal' | 'vertical'
  style?: React.CSSProperties
}

export default function RangeColumnChart({ title, dataSource, direction, ...extra }: RangeColumnChartProps) {
  const domRef = useRef<HTMLDivElement>(null)

  const dataList = useMemo(() => {
    if (!checkDataSourceIsComplete(dataSource, rangeColumnValueFields)) return []

    return [dataSource]
  }, [dataSource])

  const { specDataList, error, loading } = useChartDataList(dataList, rangeColumnValueFields)

  useEffect(() => {
    if (!domRef.current || error.isError || loading || !dataList.length || !specDataList.length) return

    const xField = dataList[0].valueField?.[minX]
    const x2Field = dataList[0].valueField?.[maxX]
    const yField = dataList[0].labelField
    if (!xField || !x2Field || !yField) return

    const spec: IRangeColumnChartSpec = {
      type: 'rangeColumn',
      data: specDataList,
      title: { text: i18n.translate(title) },
      minField: xField,
      maxField: x2Field,
      direction,
      label: {
        visible: true,
      },
      [direction === 'horizontal' ? 'yField' : 'xField']: yField,
    }

    const chart = new VChart(spec, { dom: domRef.current })
    chart.renderAsync()

    return () => {
      chart.release()
    }
  }, [domRef.current, title, specDataList, dataList, loading, error, direction])

  return (
    <div
      ref={domRef}
      {...extra}>
      {error.isError && !specDataList.length && (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>{error?.msg || '配置错误'}</span>
        </div>
      )}
      {loading && (
        <Spin
          loading
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  )
}
