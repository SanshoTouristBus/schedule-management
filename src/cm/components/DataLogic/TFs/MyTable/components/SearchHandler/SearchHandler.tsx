import {paginationPrefix} from 'src/non-common/searchParamStr'

/**
 * ページングパラメータを削除する共通関数
 * @param query - 現在のクエリオブジェクト
 * @param newQuery - 新しいクエリオブジェクト（このオブジェクトにページングパラメータをundefinedとして追加）
 */
export const resetPaginationParams = (query: Record<string, any>, newQuery: Record<string, any>) => {
  Object.keys(query).forEach(key => {
    if (key.startsWith(paginationPrefix)) {
      if (key.endsWith('_P') || key.endsWith('_S') || key.endsWith('_T')) {
        newQuery[key] = undefined
      }
    }
  })
}

export const confirmSearch = ({
  allData,
  MainColObject,
  SearchColObject,
  dataModelName,
  addQuery,
  searchQueryKey,
  SearchQuery,
  toggleLoad,
  query,
}) => {
  const searchQueryResult = SearchQuery.createQueryStr({allData, MainColObject, SearchColObject})

  const newQuery = {
    [searchQueryKey]: `${dataModelName.toUpperCase()}${searchQueryResult}`,
  }

  // ページングパラメータを削除（新しいプレフィックス方式に対応）
  resetPaginationParams(query, newQuery)

  toggleLoad(async () => {
    addQuery(newQuery)
  })
}
