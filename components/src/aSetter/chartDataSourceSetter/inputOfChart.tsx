import { useMemo } from 'react'
import { LongText } from '@easy-coder/sdk/helper'
import { i18n } from '@easy-coder/sdk/i18n'
import { Select, Input } from '@arco-design/web-react'

import { InputData } from './type'
import local from './local'
import { parseData } from '../../aUtils/inputData'

interface Props {
  value?: Omit<InputData, 'from'>
  disabled?: boolean
  onChange?: (value?: Omit<InputData, 'from'>) => void
}

export default function InputOfChart({ value, disabled, onChange }: Props) {
  const totalColumns = useMemo(() => {
    const data = parseData(value?.data)
    if (!data.length) return 0

    return Object.keys(data[0]).length
  }, [value?.data])

  const columnOptions = useMemo(() => {
    return new Array(totalColumns).fill(1).map((_, index) => ({
      value: `${index}`,
      label: i18n.translate({
        zh: `第${index + 1}列`,
        en: `Column ${index + 1}`,
      }),
    }))
  }, [totalColumns])

  return (
    <>
      <div className="chart-data-source-setter-row">
        <LongText
          className="chart-data-source-setter-label"
          text={local.data}
        />
        <Input.TextArea
          disabled={disabled}
          value={value?.data}
          rows={8}
          onChange={(v) => onChange?.({ ...value, data: v, valueField: undefined, labelField: undefined })}
        />
      </div>
      <div className="chart-data-source-setter-row">
        <LongText
          className="chart-data-source-setter-label"
          text={local.yAxis}
        />
        <Select
          getPopupContainer={() => document.body}
          options={columnOptions}
          size="mini"
          disabled={disabled}
          value={value?.valueField}
          onChange={(v) => onChange?.({ ...value, valueField: v })}
        />
      </div>
      <div className="chart-data-source-setter-row">
        <LongText
          className="chart-data-source-setter-label"
          text={local.xAxis}
        />
        <Select
          getPopupContainer={() => document.body}
          options={columnOptions}
          size="mini"
          disabled={disabled}
          value={value?.labelField}
          onChange={(v) => onChange?.({ ...value, labelField: v })}
        />
      </div>
    </>
  )
}
