import { useEffect, useMemo, useRef } from 'react'
import { VChart, ILinearProgressChartSpec, ICircularProgressChartSpec } from '@visactor/vchart'
import { Spin } from '@arco-design/web-react'
import { i18n, Multilingual } from '@easy-coder/sdk/i18n'
import { EasyCoderElement } from '@easy-coder/sdk/store'

import { DataSourceWithChart } from '../aSetter/commonPanelSetter/type'
import useChartDataList from '../aHooks/useChartDataList'
import { checkDataSourceIsComplete } from '../aUtils/dataSource'
import { progressValueFields, valueField } from './config'

export interface ProgressChartProps extends EasyCoderElement.DataProps {
  title?: Multilingual
  dataSource?: DataSourceWithChart
  type?: 'liner' | 'circular'
  rate?: number
  style?: React.CSSProperties
}

export default function ProgressChart({ title, dataSource, type, rate, ...extra }: ProgressChartProps) {
  const domRef = useRef<HTMLDivElement>(null)

  const dataList = useMemo(() => {
    if (!checkDataSourceIsComplete(dataSource, progressValueFields)) return []

    return [dataSource]
  }, [dataSource])

  const { specDataList, error, loading } = useChartDataList(dataList, progressValueFields)

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

    const spec: ILinearProgressChartSpec | ICircularProgressChartSpec =
      type === 'circular'
        ? {
            type: 'circularProgress',
            data: afterDivRateDataList,
            valueField: valueFieldName,
            categoryField: dataList[0].labelField,
            seriesField: dataList[0].labelField,
            legends: {
              visible: true,
              orient: 'bottom',
            },
            indicator: {
              visible: true,
              trigger: 'hover',
              title: {
                visible: true,
                field: dataList[0].labelField,
                autoLimit: true,
              },
              content: [
                {
                  visible: true,
                  field: valueFieldName,
                },
              ],
            },
          }
        : {
            type: 'linearProgress',
            data: afterDivRateDataList,
            xField: dataList[0].valueField?.[valueField],
            yField: dataList[0].labelField,
            seriesField: dataList[0].labelField,
            title: { text: i18n.translate(title) },
            cornerRadius: 20,
            legends: {
              visible: true,
              orient: 'bottom',
            },
            axes: [
              {
                orient: 'left',
                label: { visible: true },
                type: 'band',
                domainLine: { visible: false },
                tick: { visible: false },
              },
            ],
          }

    const chart = new VChart(spec, { dom: domRef.current })
    chart.renderAsync()

    return () => {
      chart.release()
    }
  }, [domRef.current, title, specDataList, dataList, loading, error, rate, type])

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
