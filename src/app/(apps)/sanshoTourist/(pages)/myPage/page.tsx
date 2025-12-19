import prisma from 'src/lib/prisma'
import { MyPageCC } from './MyPageCC'
import { initServerComopnent } from 'src/non-common/serverSideFunction'
import { getStHolidays } from '../../(server-actions)/holiday-actions'
import { getStUserHolidays } from '../../(server-actions)/user-holiday-actions'
import { getDrivers } from '../../(server-actions)/driver-actions'

// データ取得
const getInitialData = async (userId: number) => {
 // 車両一覧
 const vehicles = await prisma.stVehicle.findMany({
  where: { active: true },
  orderBy: { sortOrder: 'asc' },
 })

 // 公開範囲設定
 const publishSetting = await prisma.stPublishSetting.findFirst({
  orderBy: { id: 'desc' },
 })

 // 祝日マスタ（広範囲で取得）
 const today = new Date()
 const dateFrom = new Date(today.getFullYear() - 1, 0, 1)
 const dateTo = new Date(today.getFullYear() + 1, 11, 31)
 const holidays = await getStHolidays({
  where: {
   dateFrom,
   dateTo,
  },
 })

 // ユーザー休日設定（広範囲で取得）
 const userHolidays = await getStUserHolidays({
  userId,
  where: {
   dateFrom,
   dateTo,
  },
 })

 return {
  vehicles,
  publishSetting,
  holidays,
  userHolidays,
 }
}

export default async function MyPagePage(props) {
 const query = await props.searchParams

 // セッションとスコープを取得
 const { session, scopes: { getSanshoTouristScopes } } = await initServerComopnent({ query })

 const { userId, isSystemAdmin } = getSanshoTouristScopes()

 if (!userId) {
  return (
   <div className="p-4 text-center">
    <p className="text-gray-500">ログインしてください。</p>
   </div>
  )
 }

 // ユーザーがsanshoTouristアプリを持っているか確認
 const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
   id: true,
   name: true,
   apps: true,
  },
 })

 if (!user || !user.apps?.includes('sanshoTourist')) {
  return (
   <div className="p-4 text-center">
    <p className="text-gray-500">このアプリへのアクセス権限がありません。</p>
    <p className="text-sm text-gray-400 mt-2">管理者に連絡してください。</p>
   </div>
  )
 }

 const { vehicles, publishSetting, holidays, userHolidays } = await getInitialData(userId)

 // ユーザー一覧を取得（管理者用のユーザー切り替えフォーム用）
 const allUsers = await getDrivers()

 // 実際のログインユーザーID（セッションのID）
 const realLoginUserId = session?.id || userId

 return (
  <div>
   <MyPageCC
    userId={userId}
    userName={user.name || '不明'}
    vehicles={vehicles}
    isSystemAdmin={isSystemAdmin}
    publishEndDate={publishSetting?.publishEndDate ?? null}
    holidays={holidays}
    userHolidays={userHolidays}
    users={allUsers.map(u => ({ id: u.id, name: u.name }))}
    realLoginUserId={realLoginUserId}
   />
  </div>
 )
}
