import { InputData } from '../aSetter/chartDataSourceSetter/type'

export function parseData(data?: string): Record<string, number | string>[] {
  if (!data) return []

  const canSplitCharts = ['\t', ' ', ',']
  const splitChart = canSplitCharts.find((item) => data.includes(item))
  if (!splitChart) return []

  const rows = data.split(/\r?\n/)
  const res: Record<string, number | string>[] = []

  for (const row of rows) {
    const columns = row.split(splitChart)
    const rowValue: Record<string, number | string> = {}

    columns.forEach((value, index) => {
      rowValue[index] = isNaN(Number(value)) ? value : Number(value)
    })

    res.push(rowValue)
  }

  return res
}

export function checkInputDataIsComplete(inputData: InputData) {
  if (!inputData.data || !inputData.labelField || !inputData.valueField) return false

  return true
}
