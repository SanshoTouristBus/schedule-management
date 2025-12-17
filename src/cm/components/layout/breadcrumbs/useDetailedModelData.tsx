'use client'

import {useEffect, useState, useMemo, useCallback} from 'react'
import {PrismaModelNames} from '@cm/types/prisma-types'
import {anyObject} from '@cm/types/utility-types'
import {generalDoStandardPrisma} from '@cm/lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'

type UseDetailedModelDataProps = {
  paramsId?: string
  pathname: string
  ModelBuilder: any
}

type UseDetailedModelDataReturn = {
  breadCrumbDisplay: any
  paramsId: string | undefined
  dataById: any
  setdataById: (data: any) => void
}

const useDetailedModelData = ({paramsId, pathname, ModelBuilder}: UseDetailedModelDataProps): UseDetailedModelDataReturn => {
  const [dataById, setdataById] = useState<any>(null)
  const [breadCrumbDisplay, setbreadCrumbDisplay] = useState<any>(null)

  // パス名からモデル名を抽出（メモ化）
  const modelName = useMemo(() => {
    const pathnameSplit = String(pathname).split('/')
    const pathnameSplitWithoutNumber = pathnameSplit.filter(d => isNaN(Number(d)))
    return pathnameSplitWithoutNumber[pathnameSplitWithoutNumber.length - 1]
  }, [pathname])

  // ゲッター関数をメモ化
  const getters = useMemo(() => {
    return ModelBuilder?.['breadCrumbDisplayMethods']
  }, [ModelBuilder])

  // データ取得関数をメモ化
  const fetchData = useCallback(async () => {
    if (!paramsId || !modelName) return

    const getter: getter = getters?.[modelName] ?? defaultGetter

    try {
      const res = await getter(modelName as PrismaModelNames, paramsId)
      const {dataById, displayName} = res ?? {}
      setdataById(dataById)
      setbreadCrumbDisplay(displayName)
    } catch (error) {
      console.error('Failed to fetch detailed model data:', error)
      setdataById(null)
      setbreadCrumbDisplay(null)
    }
  }, [paramsId, modelName, getters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    breadCrumbDisplay,
    paramsId,
    dataById,
    setdataById,
  }
}

export default useDetailedModelData

export type getter = (modelName: PrismaModelNames, paramsId: string) => Promise<{displayName: any; dataById: anyObject}>
const defaultGetter: getter = async (modelName, paramsId) => {
  if (modelName) {
    const {result: dataById} = await generalDoStandardPrisma(modelName, `findUnique`, {where: {id: Number(paramsId)}})
    const displayName = dataById?.name ?? '詳細'
    return {dataById, displayName}
  } else {
    return {dataById: null, displayName: null}
  }
}
