import { useEffect, useMemo, useRef } from 'react'
import { VChart, IHistogramChartSpec } from '@visactor/vchart'
import { Spin } from '@arco-design/web-react'
import { i18n, Multilingual } from '@easy-coder/sdk/i18n'
import { EasyCoderElement } from '@easy-coder/sdk/store'

import { DataSourceWithChart } from '../aSetter/commonPanelSetter/type'
import useChartDataList from '../aHooks/useChartDataList'
import { checkDataSourceIsComplete } from '../aUtils/dataSource'
import { histogramValueFields, minX, maxX, value } from './config'

export interface HistogramChartProps extends EasyCoderElement.DataProps {
  title?: Multilingual
  dataSource?: DataSourceWithChart
  direction?: 'horizontal' | 'vertical'
  style?: React.CSSProperties
}

export default function HistogramChart({ title, dataSource, direction, ...extra }: HistogramChartProps) {
  const domRef = useRef<HTMLDivElement>(null)

  const dataList = useMemo(() => {
    if (!checkDataSourceIsComplete(dataSource, histogramValueFields, true)) return []

    return [dataSource]
  }, [dataSource])

  const { specDataList, error, loading } = useChartDataList(dataList, histogramValueFields, true)

  useEffect(() => {
    if (!domRef.current || error.isError || loading || !dataList.length || !specDataList.length) return

    const xField = dataList[0].valueField?.[minX]
    const x2Field = dataList[0].valueField?.[maxX]
    const yField = dataList[0].valueField?.[value]
    if (!xField || !x2Field || !yField) return

    const fieldMap =
      direction === 'horizontal'
        ? {
            yField: xField,
            y2Field: x2Field,
            xField: yField,
          }
        : {
            xField,
            x2Field,
            yField,
          }

    const spec: IHistogramChartSpec = {
      type: 'histogram',
      data: specDataList,
      title: { text: i18n.translate(title) },
      ...fieldMap,
      direction,
      axes: [{ orient: 'bottom', label: { visible: true }, nice: false }],
      label: {
        visible: true,
      },
      tooltip: {
        visible: true,
        mark: {
          content: [
            {
              key: (record) => `${record[xField]} ~ ${record[x2Field]}`,
              value: (record) => record[yField],
            },
          ],
        },
      },
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
