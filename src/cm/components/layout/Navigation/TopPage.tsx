'use client'

import React, {useEffect, useState, useMemo} from 'react'
import useGlobal from '@cm/hooks/globalHooks/useGlobal'
import {C_Stack} from '@cm/components/styles/common-components/common-components'
import {PAGES, pathItemType} from 'src/non-common/path-title-constsnts'
import {HREF} from '@cm/lib/methods/urls'
import {T_LINK} from '@cm/components/styles/common-components/links'

const TopPage = React.memo(() => {
  const {session, rootPath, pathname, query, roles} = useGlobal()
  const [navItems, setNavItems] = useState<any[]>([])

  useEffect(() => {
    if (session && rootPath) {
      const pageGetterMethod = PAGES[`${rootPath}_PAGES`]
      if (pageGetterMethod) {
        const {navItems} = pageGetterMethod({
          session,
          rootPath,
          pathname,
          query,
          dynamicRoutingParams: {},
          roles,
        })
        setNavItems(navItems)
      }
    }
  }, [session, rootPath, pathname, query, roles])

  // フィルタリングされたナビゲーションアイテムをメモ化
  const excludedNavitems = useMemo(() => {
    return navItems
      .map(category => ({
        ...category,
        children: category.children?.filter((item: pathItemType) => {
          return item.exclusiveTo !== false
        }),
      }))
      .filter(category => category?.children?.length > 0)
  }, [navItems])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <C_Stack className="gap-[60px]">
        {excludedNavitems.map((category, i) => (
          <div key={i} className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-600">{category.label}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.children?.map((item: pathItemType, i: number) => {
                const {href, label} = item

                return (
                  <T_LINK
                    key={i}
                    href={HREF(href, {}, query)}
                    simple
                    className="cursor-pointer flex-col items-center rounded-lg bg-white p-4 py-6 shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-center text-xl font-bold text-blue-600">{label}</div>
                  </T_LINK>
                )
              })}
            </div>
          </div>
        ))}
      </C_Stack>
    </div>
  )
})

TopPage.displayName = 'TopPage'

export default TopPage
