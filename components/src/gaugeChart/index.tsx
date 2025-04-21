import { useEffect, useMemo, useRef } from 'react'
import { VChart, IGaugeChartSpec } from '@visactor/vchart'
import { Spin } from '@arco-design/web-react'
import { i18n, Multilingual } from '@easy-coder/sdk/i18n'
import { EasyCoderElement } from '@easy-coder/sdk/store'

import { DataSourceWithChart } from '../aSetter/commonPanelSetter/type'
import useChartDataList from '../aHooks/useChartDataList'
import { checkDataSourceIsComplete } from '../aUtils/dataSource'
import { gaugeValueFields, valueField } from './config'

export interface GaugeChartProps extends EasyCoderElement.DataProps {
  title?: Multilingual
  dataSource?: DataSourceWithChart
  rate?: number
  style?: React.CSSProperties
}

export default function GaugeChart({ title, dataSource, rate, ...extra }: GaugeChartProps) {
  const domRef = useRef<HTMLDivElement>(null)

  const dataList = useMemo(() => {
    if (!checkDataSourceIsComplete(dataSource, gaugeValueFields)) return []

    return [dataSource]
  }, [dataSource])

  const { specDataList, error, loading } = useChartDataList(dataList, gaugeValueFields)

  useEffect(() => {
    if (!domRef.current || error.isError || loading || !dataList.length || !specDataList.length) return

    const valueFieldName = dataList[0].valueField?.[valueField]
    const afterDivRateDataList = rate
      ? specDataList.map((item) => {
          return {
            id: item.id,
            values: item.values.map((row) => {
              return { ...row, [valueFieldName]: row[valueFieldName] / rate }
            }),
          }
        })
      : specDataList

    const spec: IGaugeChartSpec = {
      type: 'gauge',
      data: afterDivRateDataList,
      valueField: valueFieldName,
      radiusField: dataList[0].labelField,
      startAngle: -180,
      endAngle: 0,
      title: { text: i18n.translate(title) },
    }

    const chart = new VChart(spec, { dom: domRef.current })
    chart.renderAsync()

    return () => {
      chart.release()
    }
  }, [domRef.current, title, specDataList, dataList, loading, error, rate])

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
