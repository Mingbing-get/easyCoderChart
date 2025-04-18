import { EasyCoderElement } from '@easy-coder/sdk/store'
import { i18n } from '@easy-coder/sdk/i18n'
import { GroupDecorator, ObjectListSetter } from '@easy-coder/sdk/design'
import { Dependency } from '@easy-coder/sdk/helper'

import CommonChart, { CommonChartProps } from '.'
import getChartWrapperStyleDefine from '../aUtils/getChartWrapperStyleDefine'
import CommonPanelSetter from '../aSetter/commonPanelSetter'
import onChartDataSourceDependencies from '../aSetter/chartDataSourceSetter/onDependencies'

const commonChartMeta: EasyCoderElement.Desc<CommonChartProps> = {
  type: 'chart_common',
  label: {
    zh: '组合图表',
    en: 'Common chart',
  },
  style: {
    style: getChartWrapperStyleDefine(),
  },
  attr: {
    title: {
      type: 'multilingual',
      label: {
        zh: '标题',
        en: 'Title',
      },
    },
    dataList: {
      type: 'array',
      label: {
        zh: '数据',
        en: 'Data',
      },
      item: {
        type: 'object',
        prototype: {},
      },
      setter: ObjectListSetter,
      setterProps: {
        labelRender: {
          fieldName: 'label',
          canEdit: true,
        },
        title: i18n.translate({ zh: '数据', en: 'Data' }),
        PanelRender: CommonPanelSetter,
      },
      onDependencies: async ({ dataCenter, contextDefine, attrValue }) => {
        if (!attrValue?.length) return []

        const deps: Pick<Dependency, 'refType' | 'refPath'>[] = []

        for (const item of attrValue) {
          deps.push(...(await onChartDataSourceDependencies({ dataCenter, contextDefine, attrValue: item })))
        }

        return deps
      },
    },
  },
  attrDecorators: [
    {
      id: 'config',
      Render: GroupDecorator,
      childrenOfAttr: ['title', 'dataList'],
      props: {
        title: i18n.translate({ zh: '配置', en: 'Config' }),
      },
    },
  ],
  Render: CommonChart,
}

export default commonChartMeta
