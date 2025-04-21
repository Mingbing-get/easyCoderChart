import { useEffect, useMemo, useRef } from 'react'
import { VChart, IWordCloudChartSpec } from '@visactor/vchart'
import { Spin } from '@arco-design/web-react'
import { i18n, Multilingual } from '@easy-coder/sdk/i18n'
import { EasyCoderElement } from '@easy-coder/sdk/store'

import { DataSourceWithChart } from '../aSetter/commonPanelSetter/type'
import useChartDataList from '../aHooks/useChartDataList'
import { checkDataSourceIsComplete } from '../aUtils/dataSource'
import { wordCloudValueFields, valueField } from './config'

export interface WordCloudChartProps extends EasyCoderElement.DataProps {
  title?: Multilingual
  dataSource?: DataSourceWithChart
  style?: React.CSSProperties
}

export default function WordCloudChart({ title, dataSource, ...extra }: WordCloudChartProps) {
  const domRef = useRef<HTMLDivElement>(null)

  const dataList = useMemo(() => {
    if (!checkDataSourceIsComplete(dataSource, wordCloudValueFields)) return []

    return [dataSource]
  }, [dataSource])

  const { specDataList, error, loading } = useChartDataList(dataList, wordCloudValueFields)

  useEffect(() => {
    if (!domRef.current || error.isError || loading || !dataList.length || !specDataList.length) return

    const spec: IWordCloudChartSpec = {
      type: 'wordCloud',
      data: specDataList,
      wordCloudConfig: {
        drawOutOfBound: 'clip',
        zoomToFit: {},
      },
      valueField: dataList[0].valueField?.[valueField],
      nameField: dataList[0].labelField,
      seriesField: dataList[0].labelField,
      title: { text: i18n.translate(title) },
    }

    const chart = new VChart(spec, { dom: domRef.current })
    chart.renderAsync()

    return () => {
      chart.release()
    }
  }, [domRef.current, title, specDataList, dataList, loading, error])

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
