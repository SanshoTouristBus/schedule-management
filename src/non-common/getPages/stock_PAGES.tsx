import {CleansePathSource, PageGetterType, pathItemType} from 'src/non-common/path-title-constsnts'
export const stock_PAGES = (props: PageGetterType) => {
  const {roles, query, session, rootPath, pathname} = props
  const pathSource: pathItemType[] = [
    // メインダッシュボード
    {
      tabId: '',
      label: '📊 スイングトレード習慣化',
      ROOT: [rootPath],
    },
    // 毎朝ルーチン
    {
      tabId: '',
      label: '🌅 毎朝ルーチン',
      ROOT: [rootPath],
      children: [
        {tabId: 'signal-screening', label: '📈 シグナルスクリーニング'},
        {tabId: 'watchlist', label: '👁️ ウォッチリスト'},
      ],
    },
    // 毎夕ルーチン
    {
      tabId: '',
      label: '🌆 毎夕ルーチン',
      ROOT: [rootPath],
      children: [{tabId: 'trade-journal', label: '📝 トレード日誌'}],
    },
    // 週次ルーチン
    {
      tabId: '',
      label: '📅 週次ルーチン',
      ROOT: [rootPath],
      children: [{tabId: 'weekly-analysis', label: '📊 週次分析'}],
    },
    // 設定・管理
    {
      tabId: '',
      label: '⚙️ 設定・管理',
      ROOT: [rootPath],
      children: [
        {tabId: 'batch', label: 'バッチ処理'},
        {tabId: 'stockConfig', label: '閾値設定'},
        {tabId: 'import-rakuten', label: '楽天証券連携'},
        {tabId: 'stock', label: '銘柄一覧', link: {query: {last_renzokuJosho: true, last_recentCrash: true}}},
        {tabId: 'stockHistory', label: '銘柄履歴'},
      ],
    },
  ]

  const {cleansedPathSource, navItems, breads, allPathsPattenrs} = CleansePathSource({
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
