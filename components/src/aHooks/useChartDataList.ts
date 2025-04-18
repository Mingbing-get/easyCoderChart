import { useCallback, useEffect, useRef, useState } from 'react'
import { useDataCenter } from '@easy-coder/sdk/data'
import { useVariableDefine, useVariableValue, useEnv } from '@easy-coder/sdk/store'

import { DataSource, ValueFieldWithLabel } from '../aSetter/chartDataSourceSetter/type'
import { fetchDataByModalData, ConditionOptions, isModalData } from '../aUtils/modalData'
import { parseData, checkInputDataIsComplete } from '../aUtils/inputData'
import { getVariableValue, checkVariableDataIsComplete } from '../aUtils/variableData'

interface SpecData {
  id: number
  values: Record<string, any>[]
}

export default function useChartDataList(dataList: DataSource[], valueFields: ValueFieldWithLabel[]) {
  const datacenter = useDataCenter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ isError: boolean; msg?: string }>({
    isError: false,
  })
  const [specDataList, setSpecDataList] = useState<SpecData[]>(createEmptySpec(dataList?.length || 0))
  const { variableDefine, initComplete } = useVariableDefine()
  const { variableValue, addDependent } = useVariableValue()
  const { isPreviewing } = useEnv()
  const variableDefineRef = useRef(variableDefine)

  const handleFetchData = useCallback(async (dataList: DataSource[], conditionOptions: ConditionOptions, isPreviewing?: boolean) => {
    setLoading(true)

    const resList = await Promise.all(
      dataList.map((item) => {
        if (isModalData(item)) {
          return fetchDataByModalData(datacenter, item, valueFields, conditionOptions, isPreviewing)
        }

        if (item.from === 'input') {
          if (!checkInputDataIsComplete(item, valueFields))
            return {
              code: -1,
              msg: '未配置完整',
              records: [],
            }

          return {
            code: 0,
            records: parseData(item.data),
          }
        }

        if (item.from === 'variable') {
          if (!checkVariableDataIsComplete(item, valueFields)) {
            return {
              code: -1,
              msg: '未配置完整',
              records: [],
            }
          }

          return getVariableValue(datacenter, item, conditionOptions)
        }

        return {
          code: -1,
          records: [],
        }
      })
    )
    const hasError = resList.find((item) => item.code !== 0)

    if (hasError) {
      setError({
        isError: true,
        msg: hasError.msg,
      })
      setSpecDataList(createEmptySpec(dataList?.length || 0))
    } else {
      setError({
        isError: false,
      })
      setSpecDataList(
        resList.map((item, index) => ({
          id: index,
          values: item.records,
        }))
      )
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    variableDefineRef.current = variableDefine
  }, [variableDefine])

  useEffect(() => {
    if (!dataList?.length || !initComplete) {
      setError({
        isError: false,
      })
      setSpecDataList(createEmptySpec(0))
      return
    }

    handleFetchData(
      dataList,
      {
        context: variableValue,
        contextDefine: variableDefineRef.current,
        onVariablePath: addDependent,
      },
      isPreviewing
    )
  }, [dataList, variableValue, initComplete, isPreviewing])

  return {
    loading,
    error,
    specDataList,
  }
}

function createEmptySpec(count: number): SpecData[] {
  return new Array(count).fill(1).map((_, index) => ({ id: index, values: [] }))
}
