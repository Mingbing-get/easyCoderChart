import { EasyCoderElement } from '@easy-coder/sdk/store'

import Container, { Props } from '.'

const containerMeta: EasyCoderElement.Desc<Props> = {
  type: 'chart_container',
  label: {
    zh: '图表容器',
    en: 'Chart container',
  },
  style: {
    style: {
      label: {
        zh: '样式',
        en: 'Style',
      },
    },
  },
  className: {
    className: {
      label: {
        zh: '样式名',
        en: 'Classname',
      },
    },
  },
  slot: {
    children: {
      label: {
        zh: '子元素',
        en: 'Children',
      },
    },
  },
  Render: Container,
}

export default containerMeta
