import { isModalData, checkModalDataIsComplete } from './modalData'
import { checkInputDataIsComplete } from './inputData'
import { checkVariableDataIsComplete } from './variableData'
import { DataSource, ValueFieldWithLabel } from '../aSetter/chartDataSourceSetter/type'

export const checkDataSourceIsComplete = (dataSource: DataSource, valueFields: ValueFieldWithLabel[], hiddenLabelField?: boolean) => {
  if (isModalData(dataSource)) {
    return checkModalDataIsComplete(dataSource, valueFields, hiddenLabelField)
  }

  if (dataSource.from === 'input') {
    return checkInputDataIsComplete(dataSource, valueFields, hiddenLabelField)
  }

  return checkVariableDataIsComplete(dataSource, valueFields, hiddenLabelField)
}
