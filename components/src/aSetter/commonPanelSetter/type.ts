import { DataSource } from '../chartDataSourceSetter/type'

type WithChart<T> = T extends any
  ? T & {
      chartType?: 'bar' | 'line' | 'area' | 'scatter' | 'pie' | 'radar' | 'funnel' | 'rose'
    }
  : never

export type DataSourceWithChart = WithChart<DataSource>
