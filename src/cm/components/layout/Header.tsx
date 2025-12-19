'use client'

import React, {Fragment, useMemo} from 'react'
import {Z_INDEX} from '@cm/lib/constants/constants'
import {HREF} from '@cm/lib/methods/urls'
import {T_LINK} from '@cm/components/styles/common-components/links'

import {R_Stack} from '@cm/components/styles/common-components/common-components'
import useWindowSize from '@cm/hooks/useWindowSize'
import {adminContext} from '@cm/components/layout/Admin/type'
import AppLogo from '@cm/components/layout/Navigation/AppLogo'
import Breadcrumbs from '@cm/components/layout/breadcrumbs/Breadcrumbs'
import NavBar from '@cm/components/layout/Navigation/NavBar'
import {cn} from '@cm/shadcn/lib/utils'

// 型定義を改善
export interface HeaderProps {
  adminContext: adminContext
}

// スタイルオブジェクトをコンポーネント外に移動
const headerStyles = {
  container: {
    zIndex: Z_INDEX.appBar,
    top: 0,
    width: '100%',
    position: 'sticky' as const,
  },
} as const

const Header = React.memo<HeaderProps>(({adminContext}) => {
  const {
    AppName,
    Logo,
    showLogoOnly,
    PageBuilderGetter,
    useGlobalProps,
    pathItemObject: {navItems, pages},
    ModelBuilder,
    horizontalMenu,
    menuContext: {MenuButton},
  } = adminContext

  const {query, rootPath} = useGlobalProps ?? {}
  const {appbarHeight, PC} = useWindowSize()

  // GlobalIdSelectorのメモ化を改善
  const GlobalIdSelector = useMemo(() => {
    if (!PageBuilderGetter?.class[PageBuilderGetter.getter]) return null
    return PageBuilderGetter.class[PageBuilderGetter.getter]({useGlobalProps})
  }, [PageBuilderGetter, useGlobalProps])

  // topLinkのメモ化
  const topLink = useMemo(() => HREF(`/${rootPath}`, {}, query), [rootPath, query])

  // additionalHeadersのレンダリングをメモ化
  const renderAdditionalHeaders = useMemo(() => {
    return adminContext?.additionalHeaders?.map((d, idx) => <Fragment key={idx}>{d}</Fragment>)
  }, [adminContext?.additionalHeaders])

  return (
    <div
      style={headerStyles.container}
      className={cn('shadow ', process.env.NEXT_PUBLIC_IS_STAGING ? 'bg-red-100' : 'shadow-primary-main bg-primary-light')}
    >
      <div>
        <R_Stack style={{minHeight: appbarHeight}} className="justify-between px-2 py-0 md:px-6">
          <R_Stack>
            {horizontalMenu === false && PC && MenuButton}
            <R_Stack className="gap-x-10">
              <T_LINK href={topLink} simple>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <AppLogo showLogoOnly={showLogoOnly} AppName={AppName} Logo={Logo} />
                </React.Suspense>
              </T_LINK>
              {PC && (
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Breadcrumbs breads={pages?.breads ?? []} ModelBuilder={ModelBuilder} />
                </React.Suspense>
              )}
            </R_Stack>

            <div>{GlobalIdSelector && <GlobalIdSelector />}</div>
            {renderAdditionalHeaders}
          </R_Stack>

          <R_Stack className="ml-auto items-center gap-2">
            <div>
              {horizontalMenu && <NavBar useGlobalProps={useGlobalProps} horizontalMenu={horizontalMenu} navItems={navItems} />}
            </div>
          </R_Stack>
          {!PC && MenuButton}
        </R_Stack>
      </div>
    </div>
  )
})

Header.displayName = 'Header'
export default Header
