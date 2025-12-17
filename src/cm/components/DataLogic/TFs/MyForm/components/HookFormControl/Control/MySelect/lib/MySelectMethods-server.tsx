import {optionType} from 'src/cm/class/Fields/col-operator-types'

export const getNameFromSelectOption = ({col, record}) => {
  if (col.forSelect?.config?.nameChanger) {
    const chanegedName = record ? col.forSelect?.config?.nameChanger(record).name : ''
    return chanegedName
  }
}

export const getSelectId = col => {
  let selectId = col.id.split('-')[2] ?? col.id

  // purposeMasterId_1_in_Purposeなどへの対応
  const strToCut = selectId.match(/_\d_in_.+/g, '')?.[0]
  selectId = selectId.replace(strToCut, '')
  return selectId
}

export const convertColIdToModelName = ({col}) => {
  const config = col?.forSelect?.config
  if (config?.modelName) return config?.modelName

  let key = col?.pseudoId ?? col?.id
  key = key
    .replace(/.+:/g, '') //カンマによるネストは省く
    .replace(/Id.+/g, '') // ~Idは省く
    .replace('Id', '')
    .replace(/g_/g, '')

  return key
}

export const mapAdjustOptionValue = (optionObjArr: optionType[]) => {
  if (Array.isArray(optionObjArr ?? [])) {
    const result = (optionObjArr ?? [])?.map(optionObj => adjustOptionValue({optionObj})) ?? []
    return [...result]
  } else {
    throw new Error('optionObjArr is not array')
  }

  function adjustOptionValue({optionObj}) {
    const value = optionObj?.value ?? optionObj?.code ?? optionObj

    const label = optionObj?.label ?? optionObj?.name
    const name = optionObj?.name

    const result: optionType = {
      value,
      id: optionObj?.id ?? value,
      label: label ?? value,
      name: name ?? value,
      color: optionObj?.color,
    }
    return result
  }
}
