import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, SelectSetter, LineDecorator } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import ChartDataSourceSetter from '../aSetter/chartDataSourceSetter'
import onChartDataSourceDependencies from '../aSetter/chartDataSourceSetter/onDependencies'
import getChartWrapperStyleDefine from '../aUtils/getChartWrapperStyleDefine'
import { progressValueFields } from './config'

import ProgressChart, { ProgressChartProps } from '.'

const progressChartMeta: EasyCoderElement.Desc<ProgressChartProps> = {
  type: 'chart_progressChart',
  label: {
    zh: '进度图',
    en: 'Progress chart',
  },
  defaultAttr: {
    rate: 1,
    type: 'liner',
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
    type: {
      type: 'string',
      label: {
        zh: '图表类型',
        en: 'Chart type',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '图表类型', en: 'Chart type' }),
        displayAs: 'button',
        options: [
          { value: 'liner', label: i18n.translate({ zh: '线型', en: 'Liner' }) },
          { value: 'circular', label: i18n.translate({ zh: '圆形', en: 'Circular' }) },
        ],
        size: 'mini',
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
        valueFields: progressValueFields,
      },
      onDependencies: onChartDataSourceDependencies,
    },
    rate: {
      type: 'number',
      label: {
        zh: '总分',
        en: 'Total',
      },
    },
  },
  attrDecorators: [
    {
      id: 'base',
      Render: GroupDecorator,
      childrenOfAttr: ['title', 'type'],
      props: {
        title: i18n.translate({ zh: '基础配置', en: 'Base Config' }),
      },
    },
    {
      id: 'line',
      Render: LineDecorator,
    },
    {
      id: 'data',
      Render: GroupDecorator,
      childrenOfAttr: ['dataSource', 'rate'],
      props: {
        title: i18n.translate({ zh: '数据配置', en: 'Data Config' }),
      },
    },
  ],
  Render: ProgressChart,
}

export default progressChartMeta
