import {makePrismaDataExtractionQuery} from '@cm/components/DataLogic/TFs/ClientConf/makePrismaDataExtractionQuery'

import {getEasySearchWhereAnd} from '@cm/class/builders/QueryBuilderVariables'
import {SearchQuery} from '@cm/components/DataLogic/TFs/MyTable/components/SearchHandler/search-methods'
import {defaultCountPerPage, P_Query} from '@cm/class/PQuery'
import {getMyTableId} from '@cm/components/DataLogic/TFs/MyTable/helpers/getMyTableId'

export const getQueryArgs = (props: {
  dataModelName
  query
  additional
  myTable
  DetailePageId
  include
  easySearchObject
  disableOrderByFromUrlParams
  countPerPage?: number
}) => {
  const {
    dataModelName,
    query,
    additional,
    myTable,
    DetailePageId,
    include,
    easySearchObject,
    disableOrderByFromUrlParams,
    countPerPage,
  } = props
  const {page, take, skip} = P_Query.getPaginationPropsByQuery({
    query,
    tableId: getMyTableId({dataModelName, myTable}),
    countPerPage: countPerPage ?? defaultCountPerPage,
  })

  const searchQueryAnd: any = SearchQuery.createWhere({dataModelName, query: query})
  const easySearchWhereAnd = getEasySearchWhereAnd({
    easySearchObject,
    query,
    additionalWhere: {...additional?.where},
  })

  const prismaDataExtractionQuery = makePrismaDataExtractionQuery({
    disableOrderByFromUrlParams,
    query,
    dataModelName,
    additional,
    myTable,
    DetailePageId,
    include,
    take,
    skip,
    page,
    easySearchWhereAnd,
    searchQueryAnd,
  })

  return {prismaDataExtractionQuery, easySearchWhereAnd, searchQueryAnd}
}
