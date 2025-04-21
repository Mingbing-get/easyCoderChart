import { Radio } from '@arco-design/web-react'
import { LongText } from '@easy-coder/sdk/helper'

import DataModalOfChart from './dataModalOfChart'
import VariableOfChart from './variableOfChart'
import InputOfChart from './inputOfChart'
import local from './local'
import { DataSource, ValueFieldWithLabel } from './type'

import './index.scss'

interface Props {
  value?: DataSource
  disabled?: boolean
  valueFields: ValueFieldWithLabel[]
  hiddenLabelField?: boolean
  onChange?: (value?: DataSource) => void
}

export default function ChartDataSourceSetter({ value, disabled, valueFields, hiddenLabelField, onChange }: Props) {
  return (
    <div className="chart-data-source-setter">
      <div className="chart-data-source-setter-row">
        <LongText
          className="chart-data-source-setter-label"
          text={local.dataFrom}
        />
        <Radio.Group
          type="button"
          size="mini"
          disabled={disabled}
          value={value?.from || 'modal'}
          onChange={(v) => onChange?.({ from: v, label: value?.label })}>
          <Radio value="modal">{local.dataModal}</Radio>
          <Radio value="variable">{local.variable}</Radio>
          <Radio value="input">{local.input}</Radio>
        </Radio.Group>
      </div>
      {(!value?.from || value?.from === 'modal') && (
        <DataModalOfChart
          value={value}
          disabled={disabled}
          valueFields={valueFields}
          hiddenLabelField={hiddenLabelField}
          onChange={onChange}
        />
      )}
      {value?.from === 'variable' && (
        <VariableOfChart
          value={value}
          disabled={disabled}
          valueFields={valueFields}
          hiddenLabelField={hiddenLabelField}
          onChange={onChange}
        />
      )}
      {value?.from === 'input' && (
        <InputOfChart
          value={value}
          disabled={disabled}
          valueFields={valueFields}
          hiddenLabelField={hiddenLabelField}
          onChange={onChange}
        />
      )}
    </div>
  )
}
