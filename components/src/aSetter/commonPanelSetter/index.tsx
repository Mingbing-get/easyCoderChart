import { ObjectPanelOrLabelRenderProps, GroupDecorator, LineDecorator } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import ChartDataSourceSetter from '../chartDataSourceSetter'
import ChartTypePicker from './chartTypePicker'
import { DataSourceWithChart } from './type'
import { LongText } from '@easy-coder/sdk/helper'

export default function CommonPanelSetter({ item, disabled, onChange }: ObjectPanelOrLabelRenderProps<DataSourceWithChart>) {
  return (
    <div style={{ width: 300 }}>
      <GroupDecorator
        title={i18n.translate({ zh: '数据配置', en: 'Data settings' })}
        canFold>
        <ChartDataSourceSetter
          value={item}
          disabled={disabled}
          onChange={onChange}
        />
      </GroupDecorator>
      <LineDecorator />
      <GroupDecorator
        title={i18n.translate({ zh: '图表配置', en: 'Chart settings' })}
        canFold>
        <div className="chart-data-source-setter">
          <div className="chart-data-source-setter-row">
            <LongText
              className="chart-data-source-setter-label"
              text={i18n.translate({ zh: '图表类型', en: 'Chart type' })}
            />
            <ChartTypePicker
              size="mini"
              getPopupContainer={() => document.body}
              disabled={disabled}
              value={item?.chartType || 'bar'}
              onChange={(v) => onChange?.({ ...item, chartType: v })}
            />
          </div>
        </div>
      </GroupDecorator>
    </div>
  )
}
