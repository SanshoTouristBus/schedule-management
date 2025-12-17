'use client'
import {pathItemType} from 'src/non-common/path-title-constsnts'
import React, {useMemo, useCallback} from 'react'
import {cl} from 'src/cm/lib/methods/common'
import useNavMenu from '@cm/components/layout/Navigation/useNavMenu'
import {UserConfig} from '@cm/components/layout/UserConfig'
import NavItemWrapper from '@cm/components/layout/Navigation/NavItem/NavItemWrapper'

type NavBarProps = {
  useGlobalProps: any
  horizontalMenu: boolean
  navItems: pathItemType[]
}

const NavBar = React.memo(({useGlobalProps, horizontalMenu, navItems}: NavBarProps) => {
  const HK_NAV = useNavMenu()

  // スタイルクラスをメモ化
  const ulClass = useMemo(() => {
    return `${horizontalMenu ? 'row-stack pr-2' : 'col-stack px-1'} w-full gap-4`
  }, [horizontalMenu])

  // マウスリーブハンドラーをメモ化
  const handleMouseLeave = useCallback(() => {
    if (horizontalMenu) {
      HK_NAV.handleCloseMenu(HK_NAV.activeNavWrapper)
    }
  }, [horizontalMenu, HK_NAV])

  // UserConfigのマウスエンターハンドラーをメモ化
  const handleUserConfigMouseEnter = useCallback(() => {
    HK_NAV.handleCloseMenu(HK_NAV.activeNavWrapper)
  }, [HK_NAV])

  // フィルタリングされたアイテムをメモ化
  const filteredItems = useMemo(() => {
    return (
      navItems?.filter((item: pathItemType) => {
        return !item?.hide && item?.exclusiveTo !== false
      }) || []
    )
  }, [navItems])

  return (
    <div
      id="navBar"
      onMouseLeave={handleMouseLeave}
      style={{height: useGlobalProps?.appbarHeight}}
      className={cl(ulClass, 'h-full ')}
    >
      {filteredItems.map((item: pathItemType, navWrapperIdx: number) => {
        // 子要素が1つの場合は直接その子要素を使用
        const processedItem = item?.children?.length === 1 ? item.children[0] : item

        return (
          <div key={navWrapperIdx}>
            <NavItemWrapper
              useGlobalProps={useGlobalProps}
              horizontalMenu={horizontalMenu}
              HK_NAV={HK_NAV}
              nestLevel={1}
              navWrapperIdx={navWrapperIdx}
              item={processedItem}
            />
          </div>
        )
      })}

      <div className="mx-2" onMouseEnter={handleUserConfigMouseEnter}>
        <UserConfig />
      </div>
    </div>
  )
})

NavBar.displayName = 'NavBar'

export default NavBar
