import { EasyCoderElement } from '@easy-coder/sdk/store'
import { Dependency } from '@easy-coder/sdk/helper'
import { obtainConditionDependencies } from '@easy-coder/sdk/variable'

import { isModalData } from '../../aUtils/modalData'
import { DataSource } from './type'

const onChartDataSourceDependencies: EasyCoderElement.UiConfig<any, DataSource>['onDependencies'] = async ({ dataCenter, contextDefine, attrValue }) => {
  const deps: Pick<Dependency, 'refPath' | 'refType'>[] = []

  if (isModalData(attrValue)) {
    if (attrValue?.modalConfig?.name) {
      const modalName = attrValue.modalConfig.name

      deps.push({
        refType: 'modal',
        refPath: [modalName],
      })

      if (attrValue.modalConfig.orders) {
        for (const order of attrValue.modalConfig.orders) {
          deps.push({
            refType: 'modalField',
            refPath: [modalName, order.key as string],
          })
        }
      }

      if (attrValue.labelField) {
        deps.push({
          refType: 'modalField',
          refPath: [modalName, attrValue.labelField],
        })
      }

      if (attrValue.valueField) {
        for (const key in attrValue.valueField) {
          deps.push({
            refType: 'modalField',
            refPath: [modalName, attrValue.valueField[key]],
          })
        }
      }

      if (attrValue.modalConfig.condition) {
        const conditionDeps = await obtainConditionDependencies(dataCenter, attrValue.modalConfig.condition, contextDefine, {
          whenTwoKeyPathIsModalField: true,
        })
        deps.push(...conditionDeps)
      }
    }
  }

  if (attrValue.from === 'variable') {
    if (attrValue.path?.length) {
      deps.push({
        refType: 'variable',
        refPath: attrValue.path,
      })
    }
  }

  return deps
}

export default onChartDataSourceDependencies
