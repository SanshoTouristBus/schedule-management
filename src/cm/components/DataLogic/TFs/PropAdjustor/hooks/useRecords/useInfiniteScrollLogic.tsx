import {useState, useCallback, useMemo} from 'react'
import {getMyTableId} from '@cm/components/DataLogic/TFs/MyTable/helpers/getMyTableId'
import { P_Query} from '@cm/class/PQuery'
import {getInitModelRecordsProps, serverFetchProps} from '@cm/components/DataLogic/TFs/Server/fetchers/getInitModelRecordsProps'
import {tableRecord} from './useRecords'

export interface UseInfiniteScrollLogicProps {
  serverFetchProps: serverFetchProps
  query: any
  rootPath: string
  records: tableRecord[] | null
  totalCount: number
  setrecords: React.Dispatch<React.SetStateAction<tableRecord[] | null>>
}

interface UseInfiniteScrollLogicReturn {
  isInfiniteScrollMode: boolean
  setInfiniteScrollMode: (enabled: boolean) => void
  currentPage: number
  isLoadingMore: boolean
  hasMore: boolean
  fetchNextPage: () => Promise<void>
  resetToFirstPage: () => void
}

// 重複を除去してレコードをマージする関数
const mergeRecordsWithoutDuplicates = (existingRecords: tableRecord[] | null, newRecords: tableRecord[]): tableRecord[] => {
  if (existingRecords === null) return newRecords

  const existingIds = new Set(existingRecords.map(record => record.id))
  const uniqueNewRecords = newRecords.filter(record => !existingIds.has(record.id))

  return [...existingRecords, ...uniqueNewRecords]
}

export const useInfiniteScrollLogic = (props: UseInfiniteScrollLogicProps): UseInfiniteScrollLogicReturn => {
  const {serverFetchProps, query, rootPath, records, totalCount, setrecords} = props

  // 無限スクロール用のstate
  const [isInfiniteScrollMode, setIsInfiniteScrollModeState] = useState(
    process.env.NEXT_PUBLIC_IS_INFINITE_SCROLL_MODE === 'true'
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // 無限スクロールモード切り替え
  const setInfiniteScrollMode = useCallback((enabled: boolean) => {
    setIsInfiniteScrollModeState(enabled)
  }, [])

  // hasMoreを計算
  const hasMore = useMemo(() => {
    if (!isInfiniteScrollMode || records === null) return false
    return records.length < totalCount
  }, [isInfiniteScrollMode, records, totalCount])

  // 次のページを取得する関数
  const fetchNextPage = useCallback(async () => {
    if (isLoadingMore || !isInfiniteScrollMode) return

    try {
      setIsLoadingMore(true)
      const nextPage = currentPage + 1
      const tableId = getMyTableId({dataModelName: serverFetchProps.dataModelName, myTable: serverFetchProps.myTable})

      // 新しいプレフィックス方式でキーを生成
      const {page: pageKey} = P_Query.createPaginationKeys(tableId)

      const nextPageQuery = {
        ...query,
        [pageKey]: nextPage,
      }

      const {queries, data} = await getInitModelRecordsProps({
        ...serverFetchProps,
        query: nextPageQuery,
        env: 'useRecords_infiniteScroll',
        rootPath: rootPath,
      })

      setrecords(prevRecords => {
        return mergeRecordsWithoutDuplicates(prevRecords, data.records)
      })
      setCurrentPage(nextPage)
    } catch (error) {
      console.error('Failed to fetch next page:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, isInfiniteScrollMode, currentPage, query, serverFetchProps, rootPath, setrecords])

  // 最初のページにリセット
  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  return {
    isInfiniteScrollMode,
    setInfiniteScrollMode,
    currentPage,
    isLoadingMore,
    hasMore,
    fetchNextPage,
    resetToFirstPage,
  }
}
