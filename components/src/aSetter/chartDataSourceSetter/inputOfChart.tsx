import { useMemo } from 'react'
import { LongText } from '@easy-coder/sdk/helper'
import { i18n } from '@easy-coder/sdk/i18n'
import { Select, Input } from '@arco-design/web-react'

import { InputData, ValueFieldWithLabel } from './type'
import local from './local'
import { parseData } from '../../aUtils/inputData'

interface Props {
  value?: Omit<InputData, 'from'>
  disabled?: boolean
  valueFields: ValueFieldWithLabel[]
  onChange?: (value?: Omit<InputData, 'from'>) => void
}

export default function InputOfChart({ value, disabled, valueFields, onChange }: Props) {
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
      {valueFields.map((field) => (
        <div
          key={field.name}
          className="chart-data-source-setter-row">
          <LongText
            className="chart-data-source-setter-label"
            text={i18n.translate(field.label)}
          />
          <Select
            getPopupContainer={() => document.body}
            options={columnOptions}
            size="mini"
            disabled={disabled}
            value={value?.valueField?.[field.name]}
            onChange={(v) => onChange?.({ ...value, valueField: { ...value.valueField, [field.name]: v } })}
          />
        </div>
      ))}
      <div className="chart-data-source-setter-row">
        <LongText
          className="chart-data-source-setter-label"
          text={local.labelField}
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
