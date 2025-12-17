'use client'
import {atomTypes, useJotaiByKey} from '@cm/hooks/useJotai'
import {useCallback, useMemo} from 'react'

type HandleOpenMenuParams = {
  navWrapperIdx: number
  hideOthers: boolean
}

const useNavMenu = () => {
  const [activeNavWrapper, setactiveNavWrapper] = useJotaiByKey<atomTypes['activeNavWrapper']>('activeNavWrapper', [])

  // メニューが開いているかチェック
  const menuIsOpen = useCallback(
    (navWrapperIdx: number) => {
      return activeNavWrapper.includes(navWrapperIdx)
    },
    [activeNavWrapper]
  )

  // メニューを開く
  const handleOpenMenu = useCallback(
    ({navWrapperIdx, hideOthers}: HandleOpenMenuParams) => {
      if (menuIsOpen(navWrapperIdx)) return

      if (hideOthers === true) {
        setactiveNavWrapper([navWrapperIdx])
      } else {
        setactiveNavWrapper(prev => [...prev, navWrapperIdx])
      }
    },
    [menuIsOpen, setactiveNavWrapper]
  )

  // メニューを閉じる
  const handleCloseMenu = useCallback(
    (targetWrapperIdxs: number[]) => {
      setactiveNavWrapper(prev => prev.filter(idx => !targetWrapperIdxs.includes(idx)))
    },
    [setactiveNavWrapper]
  )

  // 単一メニューの切り替え
  const toggleSingleMenu = useCallback(
    (navWrapperIdx: number) => {
      const open = menuIsOpen(navWrapperIdx)

      if (open) {
        handleCloseMenu([navWrapperIdx])
      } else {
        handleOpenMenu({navWrapperIdx, hideOthers: false})
      }
    },
    [menuIsOpen, handleCloseMenu, handleOpenMenu]
  )

  // 戻り値をメモ化
  return useMemo(
    () => ({
      toggleSingleMenu,
      handleOpenMenu,
      menuIsOpen,
      handleCloseMenu,
      activeNavWrapper,
      setactiveNavWrapper,
    }),
    [toggleSingleMenu, handleOpenMenu, menuIsOpen, handleCloseMenu, activeNavWrapper, setactiveNavWrapper]
  )
}

export default useNavMenu
