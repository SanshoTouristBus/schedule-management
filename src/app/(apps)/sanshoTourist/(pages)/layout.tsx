import { PageBuilder } from '../(builders)/PageBuilder'
import Admin from '@cm/components/layout/Admin/Admin'

export default async function AppLayout(props) {
  const { children } = props

  return (
    <Admin
      {...{
        AppName: '観光バス予約管理',
        PagesMethod: 'sanshoTourist_PAGES',
        PageBuilderGetter: { class: PageBuilder, getter: 'getGlobalIdSelector' },
      }}
    >
      <div>
        <div>{children}</div>
      </div>
    </Admin>
  )
}
