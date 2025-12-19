'use client'
import {getChildrenCount, getItemProps, navItemProps} from 'src/cm/components/layout/Navigation/NavItem/NavItemWrapper'

import {HREF} from 'src/cm/lib/methods/urls'

import {cl} from '@cm/lib/methods/common'
import React from 'react'
import {T_LINK} from '@cm/components/styles/common-components/links'
import {twMerge} from 'tailwind-merge'
const NavItemParent = React.memo((props: navItemProps) => {
  const {item, nestLevel = 1, navWrapperIdx, useGlobalProps, HK_NAV, horizontalMenu} = props

  const {isParent, hasChildren, label, childrenCount} = getItemProps({item, nestLevel})

  const {pathname, query} = useGlobalProps
  const queryOnPath = item.link?.query

  const href = getHref({item, childrenCount, query, queryOnPath})
  const isActive = checkIsActive({item, pathname, query, queryOnPath, href})
  const {linkClass} = getLinkClass({isActive, isParent, horizontalMenu})

  const handleOpenMenu = () => {
    const hideOthers = horizontalMenu ? true : false
    HK_NAV.handleOpenMenu({navWrapperIdx, hideOthers: hideOthers})
  }

  const menuIsOpen = HK_NAV.activeNavWrapper.some(wrapper => wrapper === navWrapperIdx)

  const selectedClass = [`bg-black/10`, `rounded-sm`, `px-1.5`]

  if (isParent && hasChildren) {
    const someChildrenIsActive = item?.children?.some(child => {
      const childrenCount = getChildrenCount(child)
      const href = getHref({item: child, childrenCount, query, queryOnPath})
      const isActive = checkIsActive({item: child, pathname, query, queryOnPath, href})

      return isActive
    })

    return (
      <div
        {...{
          onMouseEnter: useGlobalProps.SP ? undefined : handleOpenMenu,
          onClick: () => HK_NAV.toggleSingleMenu(navWrapperIdx),
        }}
      >
        <div className={cl(linkClass, `row-stack flex-nowrap items-center justify-between gap-1.5 py-2`)}>
          <div className={`w-fit`}>
            <div {...{className: cl(someChildrenIsActive ? selectedClass.join(' ') : '')}}>{label}</div>
          </div>
          <div className={`w-fit text-xs transition-transform duration-500 ${menuIsOpen ? 'rotate-180' : ''}`}>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    )
  } else {
    //アイテム自身
    if (item.tabId) {
      return (
        <>
          <T_LINK
            {...{
              target: item?.target,
              href,
              simple: true,
              className: twMerge(
                //
                nestLevel > 1 ? `p-1 py-1.5 my-0.5 ` : 'p-1',
                isActive ? selectedClass.join(' ') : '',
                `hover:bg-black/10 hover:rounded-sm`,
                linkClass,
                `inline-block`
              ),
            }}
          >
            {label}
          </T_LINK>
        </>
      )
    }
    return <></>
  }
})
export default NavItemParent

const getLinkClass = ({isActive, isParent, horizontalMenu}) => {
  const activeClass = ``
  let linkClass = 'transition-all duration-200 hover:cursor-pointer '
  linkClass += ` ${isActive ? activeClass : ''}  `
  if (horizontalMenu) {
    linkClass += `${!isParent ? ' w-full ' : ''}`
  } else {
    // SPの時
    linkClass += `  w-full ${isParent || isActive ? 'border-b  mt-1' : 'border-b border-dashed'} `
    linkClass += ` ${isParent ? ' text-lg  ' : ' '}`
  }
  return {linkClass}
}

function checkIsActive({item, pathname, query, queryOnPath, href}) {
  const pathIsActive =
    href.replace(/\?.+/, '') === pathname || item?.children?.find(child => String(child?.href)?.replace(/\?.+/, '') === pathname)
  const queryIsActive = !queryOnPath ? true : Object.keys(queryOnPath).every(key => query[key] === queryOnPath[key])

  const isActive = pathIsActive && queryIsActive
  return isActive
}

function getHref({item, childrenCount, query, queryOnPath}) {
  let href = ''

  if (childrenCount < 2) {
    href = item?.href ? HREF(item?.href, {...queryOnPath}, query) : ''
  }
  return href
}
