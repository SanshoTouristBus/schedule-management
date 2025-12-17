import IconLetter from '@cm/components/styles/common-components/IconLetter'
import { Calendar, User, Settings, ListIcon, Home } from 'lucide-react'

import { CleansePathSource, PageGetterType } from 'src/non-common/path-title-constsnts'
import { getScopes } from 'src/non-common/scope-lib/getScopes'

export const sanshoTourist_PAGES = (props: PageGetterType) => {
  const { roles = [] } = props
  const { session, rootPath, pathname, query } = props

  const scopes = getScopes(session, { query, roles })
  const { login, admin } = scopes

  // 乗務員メニュー
  const driverPath = [
    {
      tabId: 'myPage',
      label: <IconLetter {...{ Icon: Home }}>マイページ</IconLetter>,
      exclusiveTo: login,
      ROOT: [rootPath],
    },
  ]

  // 管理メニュー（編集者以上）
  const editorPath = [
    {
      tabId: 'schedule',
      label: <IconLetter {...{ Icon: Calendar }}>スケジュール管理</IconLetter>,
      ROOT: [rootPath],
    },
  ].map(item => ({
    ...item,
    exclusiveTo: login,
    ROOT: [rootPath],
  }))

  // マスタ管理メニュー（管理者のみ）
  const adminPath = [
    {
      tabId: 'master',
      label: <IconLetter {...{ Icon: ListIcon }}>マスタ管理</IconLetter>,

    },
    // {
    //   tabId: '',
    //   label: <IconLetter {...{Icon: ListIcon}}>マスタ管理</IconLetter>,
    //   children: [
    //     {
    //       tabId: 'stVehicle',
    //       label: <IconLetter {...{Icon: Truck}}>車両マスタ</IconLetter>,
    //     },
    //     {
    //       tabId: 'stCustomer',
    //       label: <IconLetter {...{Icon: Building}}>会社マスタ</IconLetter>,
    //     },
    //     {
    //       tabId: 'stContact',
    //       label: <IconLetter {...{Icon: UserCheck}}>担当者マスタ</IconLetter>,
    //     },
    //     {
    //       tabId: 'stHoliday',
    //       label: <IconLetter {...{Icon: Flag}}>祝日マスタ</IconLetter>,
    //     },
    //     {
    //       tabId: 'stDriver',
    //       label: <IconLetter {...{Icon: User}}>乗務員マスタ</IconLetter>,
    //     },
    //   ],
    // },
    {
      tabId: '',
      label: <IconLetter {...{ Icon: Settings }}>設定</IconLetter>,
      children: [
        {
          tabId: 'settings',
          label: <IconLetter {...{ Icon: Settings }}>公開範囲設定</IconLetter>,
        },
        {
          tabId: 'user',
          label: <IconLetter {...{ Icon: User }}>ユーザー管理</IconLetter>,
        },
        {
          tabId: `roleMaster`,
          label: <IconLetter {...{ Icon: Settings }}>権限管理</IconLetter>,
        },
      ],
    },
  ].map(item => ({
    ...item,
    exclusiveTo: admin,
    ROOT: [rootPath],
  }))

  const pathSource = [
    { tabId: 'top', label: 'トップ', hide: true, ROOT: [rootPath] },
    ...driverPath,
    ...editorPath,
    ...adminPath,
  ]

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

