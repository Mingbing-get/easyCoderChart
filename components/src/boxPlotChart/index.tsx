import { useEffect, useMemo, useRef } from 'react'
import { VChart, IBoxPlotChartSpec } from '@visactor/vchart'
import { Spin } from '@arco-design/web-react'
import { i18n, Multilingual } from '@easy-coder/sdk/i18n'
import { EasyCoderElement } from '@easy-coder/sdk/store'

import { DataSourceWithChart } from '../aSetter/commonPanelSetter/type'
import useChartDataList from '../aHooks/useChartDataList'
import { checkDataSourceIsComplete } from '../aUtils/dataSource'
import { boxPlotValueFields, minField, q1Field, medianField, q3Field, maxField } from './config'

export interface BoxPlotChartProps extends EasyCoderElement.DataProps {
  title?: Multilingual
  dataSource?: DataSourceWithChart
  direction?: 'horizontal' | 'vertical'
  style?: React.CSSProperties
}

export default function BoxPlotChart({ title, dataSource, direction, ...extra }: BoxPlotChartProps) {
  const domRef = useRef<HTMLDivElement>(null)

  const dataList = useMemo(() => {
    if (!checkDataSourceIsComplete(dataSource, boxPlotValueFields)) return []

    return [dataSource]
  }, [dataSource])

  const { specDataList, error, loading } = useChartDataList(dataList, boxPlotValueFields)

  useEffect(() => {
    if (!domRef.current || error.isError || loading || !dataList.length || !specDataList.length) return

    const spec: IBoxPlotChartSpec = {
      type: 'boxPlot',
      data: specDataList,
      minField: dataList[0].valueField?.[minField],
      q1Field: dataList[0].valueField?.[q1Field],
      medianField: dataList[0].valueField?.[medianField],
      q3Field: dataList[0].valueField?.[q3Field],
      maxField: dataList[0].valueField?.[maxField],
      [direction === 'horizontal' ? 'yField' : 'xField']: dataList[0].labelField,
      title: { text: i18n.translate(title) },
      direction,
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
