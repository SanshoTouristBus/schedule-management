import {additionalPropsType} from '@cm/types/types'
import {PrismaModelNames} from '@cm/types/prisma-types'
import {SearchQuery} from '@cm/components/DataLogic/TFs/MyTable/components/SearchHandler/search-methods'

export type makeEasySearcherQueryReturnType = ReturnType<typeof makeEasySearcherQuery>
export const makeEasySearcherQuery = async (props: {
  EasySearchBuilder: any
  dataModelName: PrismaModelNames
  additional: additionalPropsType
  session: any
  query: any
  easySearchExtraProps: any
}) => {
  const {EasySearchBuilder, dataModelName, additional, session, query, easySearchExtraProps} = props

  const EasySearchBuilderFunc = await EasySearchBuilder?.()
  const easySearchObject = await EasySearchBuilderFunc?.[dataModelName]?.({
    additionalWhere: additional?.where,
    session,
    query,
    dataModelName,
    easySearchExtraProps: easySearchExtraProps,
  })

  const searchQueryAnd: any = SearchQuery.createWhere({dataModelName, query: query})

  const EasySearchDataSwrFetcherProps = {
    dataModelName,
    additional: {
      ...additional,
      //詳細検索状態を反映させる
      where: {...additional?.where},
    },
    searchQueryAnd,
    easySearchObject,
    query,
  }

  return EasySearchDataSwrFetcherProps
}
