import { additionalPropsType, dataModelNameType } from '@cm/types/types'

import { anyObject } from '@cm/types/utility-types'

import { getModelFieldsInfomation } from '@cm/lib/methods/prisma-schema'

export type myFormDefaultUpsertPropType = {
  latestFormData: anyObject
  extraFormState: anyObject
  dataModelName: dataModelNameType
  additional: additionalPropsType
  formData: any
  columns
}

export const separateFormData = ({ dataModelName, latestFormData, additionalPayload, columns }) => {
  const prismaDataObject = { ...latestFormData, ...additionalPayload }

  Object.keys(prismaDataObject).forEach(key => {
    if (key.includes('readOnly')) {
      delete prismaDataObject[key]
    }
  })

  const { primitiveFieldObj, objectFieldObj } = getModelFieldsInfomation(dataModelName)

  // // const basicFields=

  // const relationIdOrigin = {...prismaDataObject}
  // const modelBasicDataOrigin = {...prismaDataObject}

  // Object.keys(modelBasicDataOrigin).forEach(key => {
  //   const col = columns.flat().find(col => col.id === key)
  //   const isNonDateObject =
  //     !Array.isArray(modelBasicDataOrigin[key]) &&
  //     typeof modelBasicDataOrigin[key] === 'object' &&
  //     !Days.validate.isDate(modelBasicDataOrigin[key]) &&
  //     modelBasicDataOrigin[key] !== null

  //   const isRelationalId = key.includes('Id')

  //   const startsWithCapital = StrHandler.startsWithCapital(key)
  //   // && Omit.includes(key) //3月27日(木) 削除

  //   const formHidenTrue = col?.form?.hidden === true

  //   if (isNonDateObject || isRelationalId || startsWithCapital || formHidenTrue) {
  //     /**リレーション先の削除 */
  //     delete modelBasicDataOrigin[key]
  //   }
  // })

  // const relationIds = {}
  // Object.keys(relationIdOrigin).forEach(key => {
  //   if (key.match(/.+Id/)) {
  //     const relationalTableId = prismaDataObject[key]

  //     relationIds[key] = relationalTableId
  //   }
  // })

  const pseudoModelBasicData: any = {}
  // const pseudoRelationIds = {}
  Object.keys(prismaDataObject).forEach(key => {
    const col = columns.flat().find(col => col.id === key)

    if (col?.form?.hidden === true) {
      return
    }

    if (primitiveFieldObj[key]) {
      pseudoModelBasicData[key] = prismaDataObject[key]
    }
  })

  const { id, ...modelBasicData } = pseudoModelBasicData
  return {
    id,
    modelBasicData: modelBasicData,
    // relationIds,
  }
}
