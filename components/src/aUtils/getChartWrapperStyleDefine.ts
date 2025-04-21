import { Multilingual } from '@easy-coder/sdk/i18n'
import { EasyCoderElement } from '@easy-coder/sdk/store'

export default function getChartWrapperStyleDefine(label?: Multilingual): EasyCoderElement.Style {
  return {
    label: label || {
      zh: '样式',
      en: 'Style',
    },
    supportModels: [
      'bottom',
      'boxShadow',
      'flex',
      'height',
      'left',
      'margin',
      'maxHeight',
      'maxWidth',
      'minHeight',
      'minWidth',
      'opacity',
      'position',
      'right',
      'top',
      'transform',
      'transition',
      'width',
      'zIndex',
      'borderColor',
      'borderStyle',
      'borderWidth',
    ],
    defaultValue: {
      borderStyle: ['solid', 'solid', 'solid', 'solid'],
      borderWidth: [
        { value: 1, unit: 'px' },
        { value: 1, unit: 'px' },
        { value: 1, unit: 'px' },
        { value: 1, unit: 'px' },
      ],
      borderColor: ['#e5e6eb', '#e5e6eb', '#e5e6eb', '#e5e6eb'],
      width: { value: 450, unit: 'px' },
      height: { value: 300, unit: 'px' },
    },
  }
}
