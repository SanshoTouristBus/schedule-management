import {CleansePathSource, PageGetterType} from '../path-title-constsnts'
import {getScopes} from '../scope-lib/getScopes'

export const training_PAGES = (props: PageGetterType) => {
  const {roles, query, session, rootPath, pathname} = props

  const {admin, login} = getScopes(session, {query, roles})

  const loginPaths = [
    {tabId: '/', label: 'カレンダ/入力'},
    {
      tabId: '',
      label: '分析',
      children: [{tabId: 'analysis', label: '月間サマリー'}],
      exclusiveTo: !!login,
    },
    {
      tabId: '',
      label: 'データ',
      children: [{tabId: 'exerciseMaster', label: '種目マスタ'}],
      exclusiveTo: !!login,
    },
    {
      tabId: '',
      label: '管理者',
      children: [
        // {tabId: 'master', label: '種目マスタ'},
        {tabId: 'settings', label: 'アプリ設定'},
        {tabId: 'user', label: 'ユーザー管理'},
        {tabId: 'workoutLog', label: '記録一覧'},
      ],
      exclusiveTo: !!admin,
    },
  ].map((item, i) => {
    return {
      ...item,
      ROOT: [rootPath],
      // exclusiveTo: !!login,
    }
  })

  const pathSource = [...loginPaths]

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
