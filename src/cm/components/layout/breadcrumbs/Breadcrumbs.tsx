'use client'

import {breadType} from 'src/non-common/path-title-constsnts'
import React, {Fragment, useMemo} from 'react'
import {cl} from 'src/cm/lib/methods/common'
import {HREF} from 'src/cm/lib/methods/urls'
import useDetailedModelData from 'src/cm/components/layout/breadcrumbs/useDetailedModelData'
import useGlobal from 'src/cm/hooks/globalHooks/useGlobal'
import {R_Stack} from '@cm/components/styles/common-components/common-components'
import {ChevronsRightIcon} from 'lucide-react'
import {useParams} from 'next/navigation'
import {T_LINK} from '@cm/components/styles/common-components/links'

type BreadcrumbsProps = {
  breads: breadType[]
  ModelBuilder: any
}

const Breadcrumbs = React.memo(({breads, ModelBuilder}: BreadcrumbsProps) => {
  const paramsId = useParams()?.id as string
  const {query, pathname} = useGlobal()
  const {breadCrumbDisplay} = useDetailedModelData({paramsId, pathname, ModelBuilder})

  // パンくずリストのプロセスをメモ化
  const processes = useMemo(() => {
    const baseProcesses = breads.map((bread: breadType, index: number) => {
      const isActive = index !== breads.length - 1 || query.paramsId
      return {
        isActive,
        component: <BreadLink bread={bread} isActive={isActive} query={query} />,
      }
    })

    if (paramsId) {
      baseProcesses.push({
        isActive: true,
        component: <BreadLink bread={{label: breadCrumbDisplay}} isActive={false} query={query} />,
      })
    }

    return baseProcesses
  }, [breads, query.paramsId, paramsId, breadCrumbDisplay, query])

  return (
    <R_Stack className="w-fit gap-0.5">
      {processes.map((p, i) => {
        const {isActive = true, component} = p

        return (
          <Fragment key={i}>
            <R_Stack className="gap-1">
              <span className={isActive ? '' : 'opacity-40'}>{component}</span>
            </R_Stack>
            {i !== processes.length - 1 && (
              <div>
                <ChevronsRightIcon className="font-bold w-4 h-4" />
              </div>
            )}
          </Fragment>
        )
      })}
    </R_Stack>
  )
})

Breadcrumbs.displayName = 'Breadcrumbs'

export default Breadcrumbs

// BreadLinkコンポーネントの型定義と最適化
type BreadLinkProps = {
  isActive: boolean
  bread: {label: string; href?: string}
  query: any
}

const BreadLink = React.memo(({isActive, bread, query}: BreadLinkProps) => {
  const href = useMemo(() => {
    return bread.href ? HREF(bread.href, {}, query) : ''
  }, [bread.href, query])

  const className = useMemo(() => {
    return cl(isActive ? 't-link onHover' : 'pointer-events-none opacity-75')
  }, [isActive])

  return (
    <div className={className}>
      {isActive && bread.href ? <T_LINK href={href}>{bread.label}</T_LINK> : <strong>{bread.label}</strong>}
    </div>
  )
})

BreadLink.displayName = 'BreadLink'
