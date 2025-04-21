import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import ChartDataSourceSetter from '../aSetter/chartDataSourceSetter'
import onChartDataSourceDependencies from '../aSetter/chartDataSourceSetter/onDependencies'
import getChartWrapperStyleDefine from '../aUtils/getChartWrapperStyleDefine'
import { wordCloudValueFields } from './config'

import WordCloudChart, { WordCloudChartProps } from '.'

const wordCloudChartMeta: EasyCoderElement.Desc<WordCloudChartProps> = {
  type: 'chart_wordCloudChart',
  label: {
    zh: '词云图',
    en: 'Word cloud chart',
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
        valueFields: wordCloudValueFields,
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
  Render: WordCloudChart,
}

export default wordCloudChartMeta
