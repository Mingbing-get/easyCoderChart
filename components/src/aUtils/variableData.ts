import { DataCenter, WithEnumsGroup } from '@easy-coder/sdk/data'
import { getVariableValueByPath, getVariableByPath, VariableDefine, variableFromModalField } from '@easy-coder/sdk/variable'

import { ValueFieldWithLabel, VariableData } from '../aSetter/chartDataSourceSetter/type'
import { ConditionOptions, formatDate } from './modalData'
import { i18n } from '@easy-coder/sdk/i18n'

export async function getVariableValue(datacenter: DataCenter, variableData: VariableData, options?: ConditionOptions, hiddenLabelField?: boolean) {
  options?.onVariablePath?.(variableData.path)

  const variableValue = await getVariableValueByPath(datacenter, variableData.path, options?.contextDefine, options?.context)
  const variableDefine = await getVariableByPath(datacenter, variableData.path, options?.contextDefine)

  if (!Array.isArray(variableValue)) {
    return {
      code: 0,
      msg: '',
      records: [],
    }
  }

  const records = variableValue.reduce((total: Record<string, any>[], item) => {
    if (Object.prototype.toString.call(item) !== '[object Object]') return total

    total.push(item)

    return total
  }, [])

  if (!hiddenLabelField) {
    const labelFieldDefine = await getObjectFieldDefineInArray(datacenter, variableDefine, variableData.labelField)
    let enumGroup: WithEnumsGroup | undefined = undefined
    if (labelFieldDefine.type === 'enum') {
      const enumGroups = await datacenter.enumGroupList()
      enumGroup = enumGroups.find((group) => group.name === labelFieldDefine.enumGroupName)
    }

    if (['datetime', 'enum', 'lookup', 'multilingual'].includes(labelFieldDefine.type)) {
      records.forEach((record) => {
        record[variableData.labelField] = transformFieldValue(record[variableData.labelField], labelFieldDefine, enumGroup)
      })
    }
  }

  return {
    code: 0,
    records,
  }
}

function transformFieldValue(value: any, field: VariableDefine.Desc, enumGroup?: WithEnumsGroup) {
  if (value === null || value === undefined) return '-'

  if (field.type === 'datetime') return formatDate(value)

  if (field.type === 'enum') {
    return i18n.translate(enumGroup?.enums?.find((item) => item.name === value)?.label) || '-'
  }

  if (field.type === 'lookup') return value?._display || '-'

  if (field.type === 'multilingual') return i18n.translate(value)

  return value
}

async function getObjectFieldDefineInArray(datacenter: DataCenter, arrDefine: VariableDefine.Desc, fieldName: string) {
  if (arrDefine.type === 'multipleLookup') {
    const modalList = await datacenter.modalList()
    const modal = modalList.find((modal) => modal.name === arrDefine.modalName)
    const field = modal?.fields?.find((field) => field.name === fieldName)
    if (!field) return

    return variableFromModalField(field)
  }

  if (arrDefine.type === 'array') {
    const item = arrDefine.item as VariableDefine.Desc
    if (item.type === 'lookup') {
      const modalList = await datacenter.modalList()
      const modal = modalList.find((modal) => modal.name === item.modalName)
      const field = modal?.fields?.find((field) => field.name === fieldName)
      if (!field) return

      return variableFromModalField(field)
    }

    if (item.type === 'object') {
      return item.prototype[fieldName]
    }
  }
}

export function checkVariableDataIsComplete(variableData: VariableData, valueFields: ValueFieldWithLabel[], hiddenLabelField?: boolean) {
  if (!variableData.path?.length || !variableData.labelField || !variableData.valueField) return false

  if (!hiddenLabelField && !variableData.labelField) return false

  for (const item of valueFields) {
    if (!variableData.valueField[item.name]) return false
  }

  return true
}
