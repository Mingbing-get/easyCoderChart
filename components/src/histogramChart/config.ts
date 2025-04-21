import { ValueFieldWithLabel } from '../aSetter/chartDataSourceSetter/type'

export const minX = 'minX'
export const maxX = 'maxX'
export const value = 'value'

export const histogramValueFields: ValueFieldWithLabel[] = [
  {
    label: {
      zh: '小值',
      en: 'Min value',
    },
    name: minX,
  },
  {
    label: {
      zh: '大值',
      en: 'Max value',
    },
    name: maxX,
  },
  {
    label: {
      zh: '高度',
      en: 'Height',
    },
    name: value,
  },
]
