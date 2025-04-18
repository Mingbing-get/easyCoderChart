import { ModalConfig } from '@easy-coder/sdk/design'
import { Multilingual } from '@easy-coder/sdk/i18n'

export interface ModalData {
  from: 'modal'
  modalConfig?: Omit<ModalConfig, 'fields'>
  method?: 'find' | 'count' | 'sum' | 'avg' | 'min' | 'max'
  limit?: number
  offset?: number
  labelField?: string
  valueField?: Record<string, string>
  label?: Multilingual
}

export interface InputData {
  from: 'input'
  data?: string
  labelField?: string
  valueField?: Record<string, string>
  label?: Multilingual
}

export interface VariableData {
  from: 'variable'
  path?: string[]
  labelField?: string
  valueField?: Record<string, string>
  label?: Multilingual
}

export type DataSource = ModalData | InputData | VariableData

export interface ValueFieldWithLabel {
  name: string
  label: Multilingual
}
