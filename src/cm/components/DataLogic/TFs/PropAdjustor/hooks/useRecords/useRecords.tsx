import useGlobal from '@cm/hooks/globalHooks/useGlobal'
import {getInitModelRecordsProps, serverFetchProps} from '@cm/components/DataLogic/TFs/Server/fetchers/getInitModelRecordsProps'
import useMyNavigation from '@cm/hooks/globalHooks/useMyNavigation'
import {useRecordsCore} from './useRecordsCore'
import {useInfiniteScrollLogic} from './useInfiniteScrollLogic'
import {dataModelNameType} from '@cm/types/types'

// 型定義を改善
export interface tableRecord {
  id: number
  [key: string]: any
}

interface UseRecordsProps {
  dataModelName: dataModelNameType
  serverFetchProps: serverFetchProps
  initialModelRecords?: Awaited<ReturnType<typeof getInitModelRecordsProps>>
  fetchTime?: Date
  countPerPage?: number
}

export type UseRecordsReturn = ReturnType<typeof useRecords>

const useRecords = (props: UseRecordsProps) => {
  const {serverFetchProps, initialModelRecords, fetchTime, dataModelName, countPerPage} = props

  const {rootPath} = useGlobal()
  const {query} = useMyNavigation()

  // 🔧 コア機能とスクロール機能を分離
  const coreLogic = useRecordsCore({
    dataModelName,
    serverFetchProps,
    initialModelRecords,
    fetchTime,
    query,
    rootPath,
    isInfiniteScrollMode: false, // 一時的にfalse、後で更新
    countPerPage,
    resetToFirstPage: () => {}, // 一時的に空関数、後で更新
  })

  const infiniteScrollLogic = useInfiniteScrollLogic({
    serverFetchProps,
    query,
    rootPath,
    records: coreLogic.records,
    totalCount: coreLogic.totalCount,
    setrecords: coreLogic.setrecords,
  })

  const resetToFirstPage = () => {
    if (process.env.NEXT_PUBLIC_IS_INFINITE_SCROLL_MODE === 'true') {
      infiniteScrollLogic.resetToFirstPage()
      coreLogic.setrecords(null)
      coreLogic.initFetchTableRecords()
    }
  }

  return {
    ...coreLogic,
    ...infiniteScrollLogic,
    resetToFirstPage,
  }
}

export default useRecords
