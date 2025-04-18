import { useEffect, useRef } from 'react'
import { EasyCoderElement } from '@easy-coder/sdk/store'
import { i18n, Multilingual } from '@easy-coder/sdk/i18n'

import { VChart, ICommonChartSpec } from '@visactor/vchart'
import { Spin } from '@arco-design/web-react'

import { DataSourceWithChart } from '../aSetter/commonPanelSetter/type'
import useChartDataList from '../aHooks/useChartDataList'
import { commValueFields } from '../aSetter/commonPanelSetter'

export interface CommonChartProps extends EasyCoderElement.DataProps {
  title?: Multilingual
  dataList?: DataSourceWithChart[]
  style?: React.CSSProperties
}

export default function CommonChart({ style, title, dataList, ...extra }: CommonChartProps) {
  const domRef = useRef<HTMLDivElement>(null)

  const { specDataList, error, loading } = useChartDataList(dataList, commValueFields)

  useEffect(() => {
    if (!domRef.current || error.isError || loading || !specDataList.length) return

    const spec: ICommonChartSpec = {
      type: 'common',
      data: specDataList,
      title: { text: i18n.translate(title) },
      series: dataList.map((item, index) => dataSourceToSeries(item, index)),
      axes: [
        { orient: 'left', seriesIndex: new Array(dataList.length).fill(1).map((_, index) => index) },
        { orient: 'bottom', label: { visible: true }, type: 'band' },
      ],
      legends: {
        visible: true,
        orient: 'bottom',
      },
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
      style={style}
      {...extra}>
      {(error.isError || !dataList?.length) && (
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

type ArrayItem<T extends Array<any>> = T extends Array<infer U> ? U : never

function dataSourceToSeries(datasource: DataSourceWithChart, index: number): ArrayItem<ICommonChartSpec['series']> {
  const id = i18n.translate(datasource.label) || index + 1

  if (!datasource.chartType || datasource.chartType === 'bar') {
    return {
      id,
      type: 'bar',
      dataIndex: index,
      label: { visible: true },
      xField: datasource.labelField,
      yField: datasource.valueField?.[commValueFields[0].name],
    }
  }

  if (datasource.chartType === 'line') {
    return {
      id,
      type: 'line',
      dataIndex: index,
      label: { visible: true },
      xField: datasource.labelField,
      yField: datasource.valueField?.[commValueFields[0].name],
    }
  }

  if (datasource.chartType === 'area') {
    return {
      id,
      type: 'area',
      dataIndex: index,
      xField: datasource.labelField,
      yField: datasource.valueField?.[commValueFields[0].name],
    }
  }

  if (datasource.chartType === 'scatter') {
    return {
      id,
      type: 'scatter',
      dataIndex: index,
      label: { visible: true },
      xField: datasource.labelField,
      yField: datasource.valueField?.[commValueFields[0].name],
    }
  }
}
