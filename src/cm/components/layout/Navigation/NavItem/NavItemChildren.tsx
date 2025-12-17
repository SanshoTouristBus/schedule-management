'use client'
import React from 'react'
import NavItemWrapper, {getItemProps, navItemProps} from 'src/cm/components/layout/Navigation/NavItem/NavItemWrapper'

import {anyObject} from '@cm/types/utility-types'
import {C_Stack} from '@cm/components/styles/common-components/common-components'
import {Card} from '@cm/shadcn/ui/card'
import {cn} from '@shadcn/lib/utils'

const NavItemChildren = React.memo((props: navItemProps) => {
  const {HK_NAV, item, nestLevel = 1, navWrapperIdx, horizontalMenu} = props

  const {hasChildren} = getItemProps({item, nestLevel})
  const menuStyle: anyObject = {zIndex: 1000}

  const {menuIsOpen} = HK_NAV

  if (!(menuIsOpen(navWrapperIdx) && hasChildren)) {
    return <></>
  }

  if (horizontalMenu) {
    return (
      <div>
        <Card
          variant="outline"
          className={cn(
            //
            `absolute -right-1/2  top-[35px] `,
            `min-w-[180px] shadow-lg  transition-all duration-200 p-2`,
            `transition-all duration-300   animate-in fade-in-0 zoom-in-95`
          )}
          style={menuStyle}
        >
          <C_Stack className={`gap-2 `}>
            {item?.children
              ?.filter(child => child.exclusiveTo !== false)
              .map((child, i) => {
                const nextLevel = nestLevel + 1

                return (
                  <div key={i} className="[&:not(:last-child)]:border-b ">
                    <NavItemWrapper {...{...props, item: child, nestLevel: nextLevel}} />
                  </div>
                )
              })}
          </C_Stack>
        </Card>
      </div>
    )
  } else {
    return (
      <div className="overflow-hidden">
        <ul className={`col-stack gap-0 pl-4 pt-1`}>
          {item?.children?.map((child, i) => {
            const nextLevel = nestLevel + 1
            return (
              <div key={i}>
                <NavItemWrapper {...{...props, item: child, nestLevel: nextLevel}} />
              </div>
            )
          })}
        </ul>
      </div>
    )
  }
})

export default NavItemChildren
