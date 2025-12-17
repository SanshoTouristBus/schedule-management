import { anyObject } from '@cm/types/utility-types'
import { JSX } from 'react'
import { getScopes } from 'src/non-common/scope-lib/getScopes'


import { sanshoTourist_PAGES } from 'src/non-common/getPages/sanshoTourist_PAGES'



export const PAGES: any = {
  sanshoTourist_PAGES,

}

export const CleansePathSource = (props: anyObject) => {
  const { rootPath, pathname, query, session, dynamicRoutingParams, roles } = props
  const { login } = getScopes(session, { query, roles })
  const { pathSource } = props

  const navItems: pathItemType[] = []
  const breads: any[] = []
  const allPathsPattenrs: object[] = []

  Object.keys(pathSource).forEach(key => {
    const item = pathSource[key]
    type roopCleansingProps = {
      parent: pathItemType
      item: pathItemType
      key?: string
    }
    /**exclusiveToによるデータクレンジング */
    const roopCleansing = (props: roopCleansingProps) => {
      const { parent, item, key } = props
      const { children } = parent
      if (children && children?.length > 0) {
        children.forEach(child => {
          roopCleansing({ parent: item, item: child })
        })
      }
    }
    roopCleansing({ parent: pathSource, item, key })
  })

  type constructItemProps = {
    item: pathItemType
    CURRENT_ROOT?: any[]
  }

  const constructItem = (props: constructItemProps) => {
    let { item } = props

    const { CURRENT_ROOT } = props
    const { tabId, link = { query: {} }, label, children, ROOT } = item

    const thisRoot = ROOT ? ROOT : (CURRENT_ROOT ?? [])
    let href: string | undefined = item?.href ?? undefined
    if (href === undefined) {
      if (thisRoot?.join('/').length > 0) {
        href = link
          ? '/' + thisRoot?.join('/') + '/' + tabId
          : // + addQuerySentence(query)
          undefined
      } else {
        href = link
          ? '/' + tabId
          : // + addQuerySentence(query)
          undefined
      }
    }

    item = { ...item, href }

    /**bread crumbようの処理 */
    const pathObject: pathItemType = {
      ...item,
      href: `/${[...thisRoot, tabId].join('/')}`,
      joinedPath: [...(thisRoot ?? []), tabId].join('/'),
    }
    allPathsPattenrs.push(pathObject)

    if (item.children) {
      item.children.forEach((item, i) => {
        const newRoot = [...thisRoot, tabId]
        constructItem({ item, CURRENT_ROOT: newRoot })
      })
    }

    return item
  }
  /**nav itemsを作る ( 部分的にbreadsの前処理を含む) */
  pathSource?.forEach((item: pathItemType) => {
    const recursive = (props: { item: pathItemType; result: pathItemType[] }) => {
      let { item } = props
      const { result } = props
      const { ROOT } = item
      item = {
        ...constructItem({ item: item, CURRENT_ROOT: ROOT }),
        children: item.children?.map(child => {
          if (child?.exclusiveTo === undefined) {
            child.exclusiveTo = item.exclusiveTo
          }
          return constructItem({
            item: child,
            CURRENT_ROOT: ROOT,
          })
        }),
      }

      if (item.exclusiveTo !== false) {
        result.push(item)
        return result
      }
    }
    recursive({ item, result: navItems })
  })

  /**breadsを作る */
  const pathnameSplit: string[] = String(pathname).split('/')

  const curr: any = []

  for (let i = 0; i < pathnameSplit.length; i++) {
    curr.push(pathnameSplit[i])
    const A = curr.join('/') //現在のパス

    const matched = allPathsPattenrs.find((path: { joinedPath: string }) => {
      const B = `/${path.joinedPath}` //ループ対象パス
      const isHit = A === B

      return isHit
    })
    if (matched) {
      breads.push(matched)
    }
  }

  return { cleansedPathSource: pathSource, navItems, breads, allPathsPattenrs }
}

export const identifyPathItem = ({ allPathsPattenrs, pathname }) => {
  const pathnameSplitArr = String(pathname).split('/')
  const matchedPathItem = allPathsPattenrs.find(item => {
    const itemHrefArray = item?.href?.split('/')

    const check = itemHrefArray.reduce((acc, cur, i) => {
      const pathSegmentMatched = pathnameSplitArr[i] === cur
      return pathSegmentMatched ? (acc += 1) : acc
    }, 0)

    return check === pathnameSplitArr.length && pathnameSplitArr.length === itemHrefArray.length
  })

  return matchedPathItem as pathItemType
}

export type pathItemType = {
  tabId?: string | RegExp
  label?: string | JSX.Element
  icon?: string
  href?: string
  target?: `_blank` | undefined
  ROOT?: string[]
  hide?: boolean
  exclusiveTo?: boolean | 'always'
  children?: pathItemType[]
  link?: {
    query?: object
  }
  joinedPath?: any
}

export type breadType = {
  href: string
  label: string
  joinedPath: string
} & pathItemType

export type PageGetterType = {
  session: anyObject
  rootPath: string
  pathname: string
  query: anyObject
  dynamicRoutingParams: anyObject
  roles: any[]
}
