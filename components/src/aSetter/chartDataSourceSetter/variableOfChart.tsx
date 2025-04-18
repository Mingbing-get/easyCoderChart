import { useCallback, useEffect, useRef, useState } from 'react'
import { LongText } from '@easy-coder/sdk/helper'
import { i18n } from '@easy-coder/sdk/i18n'
import { useDataCenter } from '@easy-coder/sdk/data'
import { VariableDefine, VariablePicker, getVariableByPath, variableFromModalField } from '@easy-coder/sdk/variable'
import { useVariableDefine } from '@easy-coder/sdk/store'
import { Select } from '@arco-design/web-react'

import local from './local'
import { VariableData, ValueFieldWithLabel } from './type'

interface Props {
  value?: Omit<VariableData, 'from'>
  disabled?: boolean
  valueFields: ValueFieldWithLabel[]
  onChange?: (value?: Omit<VariableData, 'from'>) => void
}

interface Option {
  value: string
  label: string
}

export default function VariableOfChart({ value, disabled, valueFields, onChange }: Props) {
  const dataCenter = useDataCenter()
  const { variableDefine, initComplete } = useVariableDefine()
  const variableDefineRef = useRef(variableDefine)
  const [valueOptions, setValueOptions] = useState<Option[]>([])
  const [labelOptions, setLabelOptions] = useState<Option[]>([])

  useEffect(() => {
    variableDefineRef.current = variableDefine
  }, [variableDefine])

  const computedOptions = useCallback(async (path?: string[]) => {
    if (!path?.length) {
      setValueOptions([])
      setLabelOptions([])
      return
    }

    const currentPickVariable = await getVariableByPath(dataCenter, path, variableDefineRef.current)
    const proVariables: Record<string, VariableDefine.Desc> = {}
    if (currentPickVariable.type === 'multipleLookup') {
      const modalList = await dataCenter.modalList()
      const modal = modalList.find((modal) => modal.name === currentPickVariable.modalName)
      modal?.fields.forEach((field) => {
        proVariables[field.name] = variableFromModalField(field)
      })
    } else if (currentPickVariable.type === 'array') {
      const item = currentPickVariable.item
      if (item.type === 'lookup') {
        const modalList = await dataCenter.modalList()
        const modal = modalList.find((modal) => modal.name === (item as VariableDefine.Lookup).modalName)
        modal?.fields.forEach((field) => {
          proVariables[field.name] = variableFromModalField(field)
        })
      } else if (item.type === 'object') {
        const _item = item as VariableDefine.Object
        for (const key in _item.prototype) {
          proVariables[key] = _item.prototype[key]
        }
      }
    }

    const valueOptions: Option[] = []
    const labelOptions: Option[] = []
    for (const key in proVariables) {
      if (['number', 'float'].includes(proVariables[key].type)) {
        valueOptions.push({
          value: key,
          label: i18n.translate(proVariables[key].label),
        })
      }

      if (['number', 'float', 'string', 'datetime', 'date', 'text', 'multilingual', 'enum', 'lookup'].includes(proVariables[key].type)) {
        labelOptions.push({
          value: key,
          label: i18n.translate(proVariables[key].label),
        })
      }
    }

    setValueOptions(valueOptions)
    setLabelOptions(labelOptions)
  }, [])

  useEffect(() => {
    if (!initComplete) return

    computedOptions(value?.path)
  }, [initComplete, value?.path])

  return (
    <>
      <div className="chart-data-source-setter-row">
        <LongText
          className="chart-data-source-setter-label"
          text={local.variable}
        />
        <VariablePicker
          size="mini"
          disabled={disabled}
          variables={variableDefine}
          variablePath={value?.path}
          canAcceptType={['array', 'multipleLookup']}
          onSelect={(path) => onChange?.({ ...value, path, valueField: undefined, labelField: undefined })}
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
            options={valueOptions}
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
          text={local.xAxis}
        />
        <Select
          getPopupContainer={() => document.body}
          options={labelOptions}
          size="mini"
          disabled={disabled}
          value={value?.labelField}
          onChange={(v) => onChange?.({ ...value, labelField: v })}
        />
      </div>
    </>
  )
}
