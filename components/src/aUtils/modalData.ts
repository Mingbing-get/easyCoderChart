import { CRUD, DataCenter, ModalField, WithEnumsGroup } from '@easy-coder/sdk/data'
import { i18n } from '@easy-coder/sdk/i18n'
import { checkConditionIsComplete, variableConditionToModalCondition, VariableDefine } from '@easy-coder/sdk/variable'

import { ModalData, DataSource, ValueFieldWithLabel } from '../aSetter/chartDataSourceSetter/type'

export interface ConditionOptions {
  context?: Record<string, any>
  contextDefine?: Record<string, VariableDefine.Desc>
  onVariablePath?: (path: string[]) => void
}

export async function fetchDataByModalData(
  dataCenter: DataCenter,
  modalData: ModalData,
  valueFields: ValueFieldWithLabel[],
  conditionOptions?: ConditionOptions,
  useExample?: boolean
) {
  if (!checkModalDataIsComplete(modalData, valueFields)) {
    return {
      code: -1,
      msg: '未完整配置',
      records: [],
    }
  }

  if (useExample) {
    return {
      code: 0,
      records: await createExampleCharts(dataCenter, modalData),
    }
  }

  let condition: false | CRUD.Condition<any> | undefined = undefined
  if (modalData.modalConfig.condition) {
    condition = await variableConditionToModalCondition({
      dataCenter,
      condition: modalData.modalConfig.condition,
      context: conditionOptions?.context,
      contextDefine: conditionOptions?.contextDefine,
      onVariablePath: conditionOptions?.onVariablePath,
    })
  }
  if (condition === false) {
    return {
      code: -1,
      msg: '条件转换错误',
      records: [],
    }
  }

  const modalList = await dataCenter.modalList()
  const curModal = modalList.find((modal) => modal.name === modalData.modalConfig.name)
  const labelField = curModal?.fields.find((field) => field.name === modalData.labelField)
  if (!labelField) {
    return {
      code: -1,
      msg: '未获取到X轴字段',
      records: [],
    }
  }
  let enumGroup: WithEnumsGroup | undefined
  if (labelField.type === 'enum') {
    const enumGroupList = await dataCenter.enumGroupList()
    enumGroup = enumGroupList.find((group) => group.name === labelField.enumGroupName)
  }

  if (!modalData.method || modalData.method === 'find') {
    const records = await dataCenter.crud(modalData.modalConfig.name, 'find', {
      orders: modalData.modalConfig.orders,
      fields: [...Object.values(modalData.valueField), modalData.labelField],
      limit: modalData.limit,
      offset: modalData.offset,
      condition,
      useApiId: true,
    })

    records.forEach((record) => {
      record[labelField.name] = transformFieldValue(record[labelField.name], labelField, enumGroup)
    })

    return {
      code: 0,
      records,
    }
  }

  const queryName = {
    count: 'countUseGroupBy',
    sum: 'sumUseGroupBy',
    avg: 'avgUseGroupBy',
    min: 'minUseGroupBy',
    max: 'maxUseGroupBy',
  }[modalData.method] as 'countUseGroupBy' | 'sumUseGroupBy' | 'avgUseGroupBy' | 'minUseGroupBy' | 'maxUseGroupBy'

  const records = await dataCenter.crud(modalData.modalConfig.name, queryName, {
    orders: modalData.modalConfig.orders,
    limit: modalData.limit,
    offset: modalData.offset,
    aggField: Object.values(modalData.valueField)[0],
    groupByFields: [modalData.labelField],
    condition,
    useApiId: true,
  })

  records.forEach((record) => {
    record[labelField.name] = transformFieldValue(record[labelField.name], labelField, enumGroup)
  })

  return {
    code: 0,
    records,
  }
}

export function checkModalDataIsComplete(modalData: ModalData, valueFields: ValueFieldWithLabel[]) {
  if (!modalData.modalConfig?.name || !modalData.labelField || !modalData.valueField) return false

  for (const item of valueFields) {
    if (!modalData.valueField[item.name]) return false
  }

  if (modalData.modalConfig.condition) {
    if (!checkConditionIsComplete(modalData.modalConfig.condition)) return false
  }

  return true
}

export async function createExampleCharts(dataCenter: DataCenter, modalData: ModalData) {
  const modalList = await dataCenter.modalList()
  const curModal = modalList.find((modal) => modal.name === modalData.modalConfig.name)
  const labelField = curModal?.fields.find((field) => field.name === modalData.labelField)
  if (!labelField) return []

  const labelValues: string[] = []
  if (labelField.type === 'enum') {
    const enumGroupList = await dataCenter.enumGroupList()
    const enumGroup = enumGroupList.find((group) => group.name === labelField.enumGroupName)
    labelValues.push(...(enumGroup?.enums || []).map((item) => i18n.translate(item.label)))
  } else if (labelField.type === 'date') {
    labelValues.push(...new Array(5).fill(1).map((_, index) => `${new Date().getFullYear()}-${ft(index + 1)}-${index + 1}`))
  } else if (labelField.type === 'datetime') {
    labelValues.push(
      ...new Array(5).fill(1).map((_, index) => `${new Date().getFullYear()}-${ft(index + 1)}-${index + 1} ${ft(index + 1)}:${ft(index + 1)}:${ft(index + 1)}`)
    )
  } else if (labelField.type === 'float' || labelField.type === 'number') {
    labelValues.push(...new Array(5).fill(1).map((_, index) => `${index + 1}`))
  } else {
    labelValues.push(...new Array(5).fill(1).map((_, index) => i18n.translate({ zh: `示例_${index + 1}`, en: `Example_${index + 1}` })))
  }

  return labelValues.map((v) => {
    const record: Record<string, any> = {
      [modalData.labelField]: v,
    }

    for (const key in modalData.valueField) {
      record[modalData.valueField[key]] = Math.floor(Math.random() * 100)
    }

    return record
  })
}

export function isModalData(v: DataSource): v is ModalData {
  return !v?.from || v.from === 'modal'
}

function transformFieldValue(value: any, field: ModalField.Field, enumGroup?: WithEnumsGroup) {
  if (value === null || value === undefined) return '-'

  if (field.type === 'datetime') return formatDate(value)

  if (field.type === 'enum') {
    return i18n.translate(enumGroup?.enums?.find((item) => item.name === value)?.label) || '-'
  }

  if (field.type === 'lookup') return value?._display || '-'

  if (field.type === 'multilingual') return i18n.translate(value)

  return value
}

export function formatDate(dateValue: string) {
  const date = new Date(dateValue)

  return `${date.getFullYear()}-${ft(date.getMonth())}-${ft(date.getDate())} ${ft(date.getHours())}:${ft(date.getMinutes())}:${ft(date.getSeconds())}`
}

function ft(num: number) {
  return `${num}`.padStart(2, '0')
}
