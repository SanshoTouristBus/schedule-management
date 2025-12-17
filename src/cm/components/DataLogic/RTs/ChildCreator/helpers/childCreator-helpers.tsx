import {StrHandler} from '@cm/class/StrHandler'
import {colType} from '@cm/types/col-types'

export const getModelData = models => {
  const parentModelIdStr = models.parent ? StrHandler.lowerCaseFirstLetter(models.parent) + 'Id' : ''
  const childrenModelIdStr = models.children ? StrHandler.lowerCaseFirstLetter(models.children) + 'Id' : ''

  return {
    parentModelIdStr,
    childrenModelIdStr,
  }
}

export const convertColumns = props => {
  const columns = props.columns as unknown as colType[][]
  // わかりきっているカラムは削除
  columns.forEach((rows, i) => {
    rows.forEach((col: {id: any}, j: any) => {
      if (props?.nonRelativeColumns?.includes(col?.id)) {
        columns[i].splice(j, 1)
      }
    })
  })
  return columns
}
