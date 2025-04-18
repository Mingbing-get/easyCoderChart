import { Select, SelectProps } from '@arco-design/web-react'
import { i18n } from '@easy-coder/sdk/i18n'

import { DataSourceWithChart } from './type'

interface Props extends Omit<SelectProps, 'options' | 'value' | 'onChange'> {
  value?: DataSourceWithChart['chartType']
  onChange?: (value?: DataSourceWithChart['chartType']) => void
}

interface ChartTypeOption {
  value: DataSourceWithChart['chartType']
  label: string
}

const chartTypeOptions: ChartTypeOption[] = [
  { value: 'bar', label: i18n.translate({ zh: '条形图', en: 'Bar' }) },
  { value: 'line', label: i18n.translate({ zh: '折线图', en: 'Line' }) },
  { value: 'area', label: i18n.translate({ zh: '面积图', en: 'Area' }) },
  { value: 'scatter', label: i18n.translate({ zh: '散点图', en: 'Scatter' }) },
]

export default function ChartTypePicker(props: Props) {
  return (
    <Select
      {...props}
      options={chartTypeOptions}
    />
  )
}
