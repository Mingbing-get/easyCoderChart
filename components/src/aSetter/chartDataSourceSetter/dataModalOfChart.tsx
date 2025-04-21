import { useEffect, useMemo, useState } from 'react'
import { LongText, useEffectCallback } from '@easy-coder/sdk/helper'
import { ModalConfig, ModalMetaSetter } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'
import { useDataCenter, Modal } from '@easy-coder/sdk/data'
import { Select, InputNumber } from '@arco-design/web-react'

import { ModalData, ValueFieldWithLabel } from './type'
import local from './local'

interface Props {
  value?: Omit<ModalData, 'from'>
  disabled?: boolean
  valueFields: ValueFieldWithLabel[]
  hiddenLabelField?: boolean
  onChange?: (value?: Omit<ModalData, 'from'>) => void
}

const methodOptions = [
  {
    value: 'find',
    label: i18n.translate({ zh: '查询', en: 'Query' }),
  },
  {
    value: 'count',
    label: i18n.translate({ zh: '统计条数', en: 'Count' }),
  },
  {
    value: 'sum',
    label: i18n.translate({ zh: '求和', en: 'Sum' }),
  },
  {
    value: 'avg',
    label: i18n.translate({ zh: '平均值', en: 'Avg' }),
  },
  {
    value: 'min',
    label: i18n.translate({ zh: '最小值', en: 'Min' }),
  },
  {
    value: 'max',
    label: i18n.translate({ zh: '最大值', en: 'Max' }),
  },
]

export default function DataModalOfChart({ value, disabled, valueFields, hiddenLabelField, onChange }: Props) {
  const [modal, setModal] = useState<Modal>()

  const datacenter = useDataCenter()

  const handleChangeModalConfig = useEffectCallback(
    (modalConfig: ModalConfig) => {
      const newValue = { ...value, modalConfig }

      if (modalConfig?.name !== value?.modalConfig?.name) {
        delete newValue.labelField
        delete newValue.valueField
      }

      onChange?.(newValue)
    },
    [value, onChange]
  )

  useEffect(() => {
    if (!value?.modalConfig?.name) {
      setModal(undefined)
      return
    }

    datacenter.modalList().then((list) => setModal(list.find((m) => m.name === value?.modalConfig?.name)))
  }, [value?.modalConfig?.name])

  const valueOptions = useMemo(() => {
    if (!modal) return []

    return modal.fields
      .filter((field) => {
        if (value?.method === 'count') return true

        if (field.type === 'number' || field.type === 'float') return true

        return false
      })
      .map((item) => ({ value: item.name, label: i18n.translate(item.label) }))
  }, [modal, value?.method])

  const labelOptions = useMemo(() => {
    if (!modal) return []

    return modal.fields
      .filter((field) => {
        if (field.type === 'json' || field.type === 'file' || field.type === 'boolean') return false

        if (field.type === 'lookup' || field.type === 'enum') {
          if (field.multiple) return false
        }

        return true
      })
      .map((item) => ({ value: item.name, label: i18n.translate(item.label) }))
  }, [modal, value?.method])

  const afterFilterMethodOptions = useMemo(() => {
    if (valueFields.length === 1 && !hiddenLabelField) return methodOptions

    return methodOptions.filter((option) => option.value === 'find')
  }, [valueFields, hiddenLabelField])

  return (
    <>
      <ModalMetaSetter
        disabled={disabled}
        value={value?.modalConfig}
        showCondition
        showOrder
        onChange={handleChangeModalConfig}
      />
      <div className="chart-data-source-setter-row">
        <LongText
          className="chart-data-source-setter-label"
          text={local.method}
        />
        <Select
          getPopupContainer={() => document.body}
          options={afterFilterMethodOptions}
          size="mini"
          disabled={disabled}
          value={value?.method || 'find'}
          onChange={(v) => onChange?.({ ...value, method: v })}
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
      {!hiddenLabelField && (
        <div className="chart-data-source-setter-row">
          <LongText
            className="chart-data-source-setter-label"
            text={local.labelField}
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
      )}
      <div className="chart-data-source-setter-row">
        <LongText
          className="chart-data-source-setter-label"
          text={local.skipCount}
        />
        <InputNumber
          size="mini"
          disabled={disabled}
          value={value?.offset}
          onChange={(v) => onChange?.({ ...value, offset: v })}
        />
      </div>
      <div className="chart-data-source-setter-row">
        <LongText
          className="chart-data-source-setter-label"
          text={local.count}
        />
        <InputNumber
          size="mini"
          disabled={disabled}
          value={value?.limit}
          onChange={(v) => onChange?.({ ...value, limit: v })}
        />
      </div>
    </>
  )
}
