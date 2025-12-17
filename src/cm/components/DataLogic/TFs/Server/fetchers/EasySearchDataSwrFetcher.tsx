'use server'
import {getEasySearchPrismaDataOnServer} from 'src/cm/class/builders/QueryBuilderVariables'
import {getEasySearchBtnCountData} from '@cm/lib/server-actions/common-server-actions/serverEasySearch'

import {PrismaModelNames} from '@cm/types/prisma-types'

import {additionalPropsType, MyTableType} from '@cm/types/types'
import {anyObject} from '@cm/types/utility-types'
import {EasySearchObject} from 'src/cm/class/builders/QueryBuilderVariables'

export type ES_Atom_FetcherProps = {
  DetailePageId
  // params: anyObject
  EasySearchBuilder: any
  dataModelName: PrismaModelNames
  additional: additionalPropsType
  myTable: MyTableType
  include: anyObject
  session: anyObject
  query: anyObject
  easySearchExtraProps: anyObject
}
export type dataCountObject = {
  [key: string]: number
}

export type easySearchPrismaDataOnServer = {
  dataCountObject: dataCountObject
  availableEasySearchObj: EasySearchObject
}

export const EasySearchDataSwrFetcher = async ({dataModelName, additional, easySearchObject, query, searchQueryAnd}) => {
  const {queryArrays, availableEasySearchObj} = getEasySearchPrismaDataOnServer({
    query,
    dataModelName,
    easySearchObject,
    additionalWhere: additional?.where,
    searchQueryAnd,
  })

  const array = await getEasySearchBtnCountData({queryArrays})

  const result: easySearchPrismaDataOnServer = {
    dataCountObject: Object.fromEntries(array),
    availableEasySearchObj,
  }

  return result
}
