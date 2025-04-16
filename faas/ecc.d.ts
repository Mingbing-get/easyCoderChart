/// <reference path="../.ecc/types/index.d.ts" />

declare interface FaasDefine {
  apiId: string
  apiName: string
  label: I18n.Multilingual
  description?: string
  params?: VariableDefine.Desc[]
  result?: VariableDefine.Desc
}
