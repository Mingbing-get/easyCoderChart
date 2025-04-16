/// <reference path="../.ecc/types/client.d.ts" />

declare interface FunctionDefine {
  apiId: string
  apiName: string
  label: I18n.Multilingual
  description?: string
  params?: VariableDefine.Desc[]
  result?: VariableDefine.Desc
  fn: Function
}
