import {optionsType, setCustomParamsType} from '@cm/components/DataLogic/types/customParams-types'

export const setCustomParams = async (props: setCustomParamsType) => {
  const {dataModelName, variants} = props

  const customParams: optionsType = {
    dataModelName,
    additional: {},
    surroundings: {},
    ColBuilderExtraProps: {},
    PageBuilderExtraProps: {},
    QueryBuilderExtraProps: {},
    easySearchExtraProps: {},
    myForm: {},
    myTable: {drag: dataModelName.includes('Master') ? {} : false},
    myModal: {},
    EditForm: undefined,
    PageBuilderGetter: undefined,
    editType: {type: 'modal'},
    displayStyle: {width: 'fit-content', margin: 'auto'},
  }

  const theVariant = variants.find(variant => {
    return variant.modelNames.includes(dataModelName)
  })

  const {setParams} = theVariant ?? {}
  const options = (await setParams?.()) ?? {}
  Object.keys(options ?? {}).forEach(key => {
    customParams[key] = options[key]
  })

  const redirectPath = options.redirectPath
  return {dataModelName, ...customParams, redirectPath}
}
