import {useState, useCallback, useEffect, useId} from 'react'
import {easySearchDataSwrType} from '@cm/class/builders/QueryBuilderVariables'
import {getInitModelRecordsProps, serverFetchProps} from '@cm/components/DataLogic/TFs/Server/fetchers/getInitModelRecordsProps'
import {tableRecord} from './useRecords'
import {atomKey, useJotaiByKey} from '@cm/hooks/useJotai'
import {dataModelNameType} from '@cm/types/types'

interface UseRecordsCoreProps {
  dataModelName: dataModelNameType
  serverFetchProps: serverFetchProps
  initialModelRecords?: Awaited<ReturnType<typeof getInitModelRecordsProps>>
  fetchTime?: Date
  query: any
  rootPath: string
  isInfiniteScrollMode: boolean
  resetToFirstPage: () => void
  countPerPage?: number
}

interface UseRecordsCoreReturn {
  records: tableRecord[] | null
  setrecords: React.Dispatch<React.SetStateAction<tableRecord[] | null>>
  totalCount: number
  easySearchPrismaDataOnServer: easySearchDataSwrType
  EasySearcherQuery: any
  prismaDataExtractionQuery: any
  initFetchTableRecords: () => Promise<void>
  updateData: () => void
  mutateRecords: ({record}: {record: tableRecord}) => void
  deleteRecord: ({record}: {record: tableRecord}) => void
}

// 初期状態を定数として分離
const INITIAL_EASY_SEARCH_DATA: easySearchDataSwrType = {
  dataCountObject: {},
  availableEasySearchObj: null,
  loading: true,
  noData: false,
  beforeLoad: true,
}

// レコード更新ロジック
const updateRecordInArray = (prev: tableRecord[] | null, record: tableRecord): tableRecord[] | null => {
  if (prev === null) return prev

  const index = prev.findIndex(r => r.id === record?.id)
  if (index !== -1) {
    const newArray = [...prev]
    newArray[index] = {...prev[index], ...record}
    return newArray
  } else {
    return [...prev, record]
  }
}

// レコード削除ロジック
const deleteRecordFromArray = (prev: tableRecord[] | null, record: tableRecord): tableRecord[] | null => {
  if (prev === null) return prev

  const index = prev.findIndex(r => r.id === record?.id)
  if (index !== -1) {
    const newArray = [...prev]
    newArray.splice(index, 1)
    return newArray
  }
  return prev
}

export const useRecordsCore = (props: UseRecordsCoreProps): UseRecordsCoreReturn => {
  const {
    serverFetchProps,
    initialModelRecords,
    dataModelName,
    query,
    rootPath,
    isInfiniteScrollMode,
    resetToFirstPage,
    countPerPage,
  } = props

  const tableId = useId()
  const globalStateKey = ['table-records', serverFetchProps.dataModelName, tableId].join('_') as atomKey

  const jotaiKey = [dataModelName, 'userRecords'].join('_') as atomKey
  const [refresedAt, setrefresedAt] = useJotaiByKey<Date | null>((jotaiKey + '-refreshedAt') as atomKey, null)
  const [totalCount, settotalCount] = useJotaiByKey<number>((jotaiKey + '-totalCount') as atomKey, 0)

  const [records, setrecords] = useJotaiByKey<tableRecord[] | null>(globalStateKey, null)

  const [easySearchPrismaDataOnServer, seteasySearchPrismaDataOnServer] =
    useState<easySearchDataSwrType>(INITIAL_EASY_SEARCH_DATA)
  const [prismaDataExtractionQuery, setprismaDataExtractionQuery] = useState({})
  const [EasySearcherQuery, setEasySearcherQuery] = useState({})

  // 初期データ取得
  const initFetchTableRecords = useCallback(async () => {
    console.time('データ取得')
    const {queries, data} = await getInitModelRecordsProps({
      ...serverFetchProps,
      query,
      env: 'useRecords',
      rootPath: rootPath,
      countPerPage,
    })

    setEasySearcherQuery(queries.EasySearcherQuery)
    setprismaDataExtractionQuery(queries.prismaDataExtractionQuery)
    seteasySearchPrismaDataOnServer(data.easySearchPrismaDataOnServer)
    setrecords(data.records)

    settotalCount(data.totalCount)

    // 無限スクロールモードの場合はページをリセット
    if (isInfiniteScrollMode) {
      resetToFirstPage()
    }

    setrefresedAt(new Date())
  }, [serverFetchProps, query, rootPath, isInfiniteScrollMode, resetToFirstPage])

  // レコード更新
  const mutateRecords = useCallback(({record}: {record: tableRecord}) => {
    setrecords(prev => updateRecordInArray(prev, record))
  }, [])

  // レコード削除
  const deleteRecord = useCallback(({record}: {record: tableRecord}) => {
    setrecords(prev => deleteRecordFromArray(prev, record))
  }, [])

  // 手動でデータを更新する関数
  const updateData = useCallback(() => {
    initFetchTableRecords()
  }, [initFetchTableRecords])

  // 無限スクロールモードが変更された時の処理
  useEffect(() => {
    if (isInfiniteScrollMode) {
      setrecords(null)
      initFetchTableRecords()
    }
  }, [isInfiniteScrollMode, initFetchTableRecords])

  const {data: InitialData, queries: InitialQueries} = initialModelRecords ?? {}
  const inittialDataCount = InitialData?.totalCount

  const setFirstData = () => {
    setrecords(InitialData?.records)
    settotalCount(inittialDataCount)
    seteasySearchPrismaDataOnServer(InitialData?.easySearchPrismaDataOnServer ?? INITIAL_EASY_SEARCH_DATA)
    setEasySearcherQuery(InitialQueries?.EasySearcherQuery ?? {})
    setprismaDataExtractionQuery(InitialQueries?.prismaDataExtractionQuery ?? {})
    setrefresedAt(new Date())
  }

  // 初期化ロジック
  useEffect(() => {
    initFetchTableRecords()

    // const hasData = inittialDataCount > 0
    // const dataIsUnset = records == null

    // if (initialModelRecords !== undefined && hasData && dataIsUnset) {
    //   console.log('初回フェッチ')
    //   setFirstData()
    // } else {
    //   if (refresedAt === null || (refresedAt && Math.abs(new Date().getTime() - refresedAt.getTime()) >= 100)) {
    //     console.log('データ取得')
    //     initFetchTableRecords()
    //   }
    // }
  }, [query])

  return {
    records,
    setrecords,
    totalCount,
    easySearchPrismaDataOnServer,
    EasySearcherQuery,
    prismaDataExtractionQuery,
    initFetchTableRecords,
    updateData,
    mutateRecords,
    deleteRecord,
  }
}
