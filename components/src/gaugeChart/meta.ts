import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import ChartDataSourceSetter from '../aSetter/chartDataSourceSetter'
import onChartDataSourceDependencies from '../aSetter/chartDataSourceSetter/onDependencies'
import getChartWrapperStyleDefine from '../aUtils/getChartWrapperStyleDefine'
import { gaugeValueFields } from './config'

import GaugeChart, { GaugeChartProps } from '.'

const gaugeChartMeta: EasyCoderElement.Desc<GaugeChartProps> = {
  type: 'chart_gaugeChart',
  label: {
    zh: '仪表盘',
    en: 'Gauge chart',
  },
  defaultAttr: {
    rate: 1,
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
        valueFields: gaugeValueFields,
      },
      onDependencies: onChartDataSourceDependencies,
    },
    rate: {
      type: 'number',
      label: {
        zh: '倍率',
        en: 'Magnification',
      },
    },
  },
  attrDecorators: [
    {
      id: 'config',
      Render: GroupDecorator,
      childrenOfAttr: ['title', 'dataSource', 'rate'],
      props: {
        title: i18n.translate({ zh: '配置', en: 'Config' }),
      },
    },
  ],
  Render: GaugeChart,
}

export default gaugeChartMeta
