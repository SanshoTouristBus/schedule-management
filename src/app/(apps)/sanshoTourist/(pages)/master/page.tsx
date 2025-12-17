import prisma from 'src/lib/prisma'
import { initServerComopnent } from 'src/non-common/serverSideFunction'
import { MasterCC } from './MasterCC'

// データ取得
const getInitialData = async () => {
  // 車両一覧（プレートNo順）
  const vehicles = await prisma.stVehicle.findMany({
    where: { active: true },
    orderBy: { plateNumber: 'asc' },
  })

  // 会社一覧（名称順、担当者も名称順）
  const customers = await prisma.stCustomer.findMany({
    where: { active: true },
    include: {
      StContact: {
        where: { active: true },
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  })

  // 祝日一覧（日付順）
  const holidays = await prisma.stHoliday.findMany({
    orderBy: { date: 'asc' },
  })

  return {
    vehicles,
    customers,
    holidays,
  }
}

export default async function MasterPage(props) {
  const query = await props.searchParams

  // セッションとスコープを取得
  const { session, scopes: { getSanshoTouristScopes } } = await initServerComopnent({ query })
  const { isSystemAdmin, isEditor, isViewer } = getSanshoTouristScopes()

  // 閲覧者以上の権限が必要
  const hasAccess = isSystemAdmin || isEditor || isViewer
  if (!hasAccess) {
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">アクセス権限がありません</h2>
        <p className="text-gray-500">このページへのアクセス権限がありません。管理者に連絡してください。</p>
      </div>
    )
  }

  // 編集可能かどうか（管理者または編集者）
  const canEdit = isSystemAdmin || isEditor

  const { vehicles, customers, holidays } = await getInitialData()

  return (
    <div className={`mx-auto p-2 w-fit`}>
      <MasterCC
        vehicles={vehicles}
        customers={customers}
        holidays={holidays}
        canEdit={canEdit}
      />
    </div>
  )
}
