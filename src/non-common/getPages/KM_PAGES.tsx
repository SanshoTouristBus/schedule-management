import { CleansePathSource, PageGetterType } from 'src/non-common/path-title-constsnts'
import { getScopes } from 'src/non-common/scope-lib/getScopes'

export const KM_PAGES = (props: PageGetterType) => {
  const { roles, query, session, rootPath, pathname } = props
  const scopes = getScopes(session, { query, roles })

  // const publicPaths = [
  //   // // {tabId: 'greeting', label: 'ご挨拶'},
  //   // {tabId: 'service', label: 'サービス'},
  //   // {tabId: 'works', label: '実績'},
  //   // {tabId: 'principle', label: '改善思想'},
  //   // {tabId: 'contact', label: 'ご依頼・お問い合わせ'},
  // ].map(item => ({...item, ...{ROOT: [rootPath]}}))
  const publicPaths = []

  const adminPaths = [
    {
      tabId: '',
      label: '設定',
      ROOT: [rootPath, 'admin'],
      exclusiveTo: scopes.admin,
      children: [
        // {tabId: 'kaizenClient', label: '取引先'},
        // {tabId: 'kaizenWork', label: '実績'},
        { tabId: 'works', label: '実績管理' },
        { tabId: 'KaizenCMS', label: 'CMS' },
      ],
    },
  ].map(item => ({
    ...item,
    exclusiveTo: scopes.admin,
  }))
  const pathSource = [{ tabId: 'top', label: 'トップ', hide: true, ROOT: [rootPath] }, ...publicPaths, ...adminPaths]

  const { cleansedPathSource, navItems, breads, allPathsPattenrs } = CleansePathSource({
    rootPath,
    pathSource,
    pathname,
    session,
  })

  return {
    allPathsPattenrs,
    pathSource: cleansedPathSource,
    navItems,
    breads,
  }
}
