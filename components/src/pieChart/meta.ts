import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import ChartDataSourceSetter from '../aSetter/chartDataSourceSetter'
import onChartDataSourceDependencies from '../aSetter/chartDataSourceSetter/onDependencies'
import getChartWrapperStyleDefine from '../aUtils/getChartWrapperStyleDefine'
import { pieValueFields } from './config'

import PieChart, { PieChartProps } from '.'

const pieChartMeta: EasyCoderElement.Desc<PieChartProps> = {
  type: 'chart_pieChart',
  label: {
    zh: '饼图',
    en: 'Pie chart',
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
    dataSource: {
      type: 'object',
      label: {
        zh: '数据',
        en: 'Data',
      },
      prototype: {},
      setter: ChartDataSourceSetter,
      setterProps: {
        valueFields: pieValueFields,
      },
      onDependencies: onChartDataSourceDependencies,
    },
  },
  attrDecorators: [
    {
      id: 'config',
      Render: GroupDecorator,
      childrenOfAttr: ['title', 'dataSource'],
      props: {
        title: i18n.translate({ zh: '配置', en: 'Config' }),
      },
    },
  ],
  Render: PieChart,
}

export default pieChartMeta
