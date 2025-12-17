import {useState, useEffect, useMemo} from 'react'
import {MenuButton} from 'src/cm/components/layout/MenuButton'

import {useGlobalPropType} from 'src/cm/hooks/globalHooks/useGlobalOrigin'

import useWindowSize from '@cm/hooks/useWindowSize'
import {adminContext, adminProps, menuContext} from '@cm/components/layout/Admin/type'
import {identifyPathItem, PAGES} from 'src/non-common/path-title-constsnts'

export const useAdminContext = (props: adminProps, useGlobalProps: useGlobalPropType) => {
  const {pathname, query} = useGlobalProps
  const {PC} = useWindowSize()
  const horizontalMenu = PC && (props.navBarPosition ?? `top`) === `top`

  const [isOpen, setIsOpen] = useState(false)

  // パス変更時にメニューを閉じる
  useEffect(() => {
    setIsOpen(false)
  }, [pathname, query])

  const toggleMenu = () => setIsOpen(!isOpen)

  // パス関連プロパティをメモ化
  const pathItemObject = useMemo(() => {
    return getPathItemRelatedProps({PagesMethod: props.PagesMethod, useGlobalProps})
  }, [props.PagesMethod, useGlobalProps])

  // メニューコンテキストをメモ化
  const menuContext: menuContext = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      toggleMenu,
      MenuButton: <MenuButton onClick={toggleMenu} />,
    }),
    [isOpen, toggleMenu]
  )

  // 管理コンテキストをメモ化
  const adminContext: adminContext = useMemo(
    () => ({
      ...props,
      pathItemObject,
      useGlobalProps,
      navBarPosition: props.navBarPosition ?? `top`,
      horizontalMenu,
      menuContext,
    }),
    [props, pathItemObject, useGlobalProps, horizontalMenu, menuContext]
  )

  return {
    adminContext,
    menuContext,
    pathItemObject,
    horizontalMenu,
  }
}

export function getPathItemRelatedProps({PagesMethod, useGlobalProps}) {
  const {roles, session, pathname, rootPath, query, dynamicRoutingParams} = useGlobalProps

  const pageGetterprops = {session, pathname, rootPath, query, dynamicRoutingParams, roles}
  const pages = PAGES[PagesMethod]?.(pageGetterprops)
  const {allPathsPattenrs} = pages ?? {}
  const matchedPathItem = identifyPathItem({allPathsPattenrs, pathname})
  const {navItems} = pages ?? {}

  return {matchedPathItem, navItems, pages}
}
