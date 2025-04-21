import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, SelectSetter, LineDecorator } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import ChartDataSourceSetter from '../aSetter/chartDataSourceSetter'
import onChartDataSourceDependencies from '../aSetter/chartDataSourceSetter/onDependencies'
import getChartWrapperStyleDefine from '../aUtils/getChartWrapperStyleDefine'
import { boxPlotValueFields } from './config'
import BoxPlotChart, { BoxPlotChartProps } from '.'

const boxPlotChartMeta: EasyCoderElement.Desc<BoxPlotChartProps> = {
  type: 'chart_boxPlotChart',
  label: {
    zh: '箱线图',
    en: 'Box plot chart',
  },
  defaultAttr: {
    direction: 'vertical',
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
    direction: {
      type: 'string',
      label: {
        zh: '方向',
        en: 'Direction',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '方向', en: 'Direction' }),
        options: [
          {
            value: 'horizontal',
            label: i18n.translate({ zh: '水平', en: 'Horizontal' }),
          },
          {
            value: 'vertical',
            label: i18n.translate({ zh: '垂直', en: 'Vertical' }),
          },
        ],
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
        valueFields: boxPlotValueFields,
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
    {
      id: 'line',
      Render: LineDecorator,
    },
    {
      id: 'style',
      Render: GroupDecorator,
      childrenOfAttr: ['direction'],
      props: {
        title: i18n.translate({ zh: '外观', en: 'Appearance' }),
      },
    },
  ],
  Render: BoxPlotChart,
}

export default boxPlotChartMeta
