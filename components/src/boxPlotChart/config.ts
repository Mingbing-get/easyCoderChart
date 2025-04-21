import { ValueFieldWithLabel } from '../aSetter/chartDataSourceSetter/type'

export const minField = 'minField'
export const q1Field = 'q1Field'
export const medianField = 'medianField'
export const q3Field = 'q3Field'
export const maxField = 'maxField'

export const boxPlotValueFields: ValueFieldWithLabel[] = [
  {
    label: {
      zh: '最小值',
      en: 'Min value',
    },
    name: minField,
  },
  {
    label: {
      zh: '四分之一分位数',
      en: 'Quartile 1',
    },
    name: q1Field,
  },
  {
    label: {
      zh: '中位数',
      en: 'Median',
    },
    name: medianField,
  },
  {
    label: {
      zh: '四分之三分位数',
      en: 'Quartile 3',
    },
    name: q3Field,
  },
  {
    label: {
      zh: '最大值',
      en: 'Max value',
    },
    name: maxField,
  },
]
