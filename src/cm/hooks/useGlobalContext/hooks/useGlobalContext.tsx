'use client'
import {useSessionContext} from '@cm/providers/SessionContextProvider'

import {useLoaderContext} from '@cm/providers/LoaderContextProvider'
import {useNavigationContext} from '@cm/providers/NavigationContextProvider'
import {useMemo} from 'react'
import {useGlobalPropType} from '@cm/hooks/globalHooks/useGlobalOrigin'

// 結合された型を定義
type CombinedGlobalData = useGlobalPropType
// セレクター用の型
type GlobalStateKeys = keyof CombinedGlobalData

export function useGlobalContext(): CombinedGlobalData {
  const sessionData = useSessionContext()
  // const deviceData = useDeviceContext()
  const loaderData = useLoaderContext()
  const navigationData = useNavigationContext()

  // 基本データの結合をメモ化
  const baseData = useMemo(
    () => ({
      // ...deviceData,
      ...navigationData,
      ...sessionData,
      ...loaderData,
    }),
    [
      // deviceData,
      navigationData,
      sessionData,
      loaderData,
    ]
  )

  // 計算プロパティをメモ化
  const computedData = useMemo(() => {
    // 現在はwaitRenderingを無効化しているが、必要に応じて有効化可能
    const waitRendering = false

    const showLoader = loaderData.globalLoaderAtom
    const useGlobalDeps = [waitRendering, showLoader]

    return {
      waitRendering,
      showLoader,
      useGlobalDeps,
    }
  }, [loaderData.globalLoaderAtom]) // waitRenderingが固定値なので、globalLoaderAtomのみ監視

  // 最終結果をメモ化
  return useMemo(
    () => ({
      ...baseData,
      ...computedData,
    }),
    [baseData, computedData]
  )
}

// 型をエクスポート
export type {CombinedGlobalData, GlobalStateKeys}
