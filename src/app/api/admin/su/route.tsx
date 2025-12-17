import {isDev} from '@cm/lib/methods/common'
import prisma from 'src/lib/prisma'
import {NextResponse} from 'next/server'

export const POST = async () => {
  const data = {
    id: 81,
    code: '999999',
    sortOrder: 0,
    name: '管理者',
    email: 'admin@gmail.com',
    password: 'admin12345',
    type: 'マネージャー',
    role: '管理者',
    storeId: 8,
    rentaStoreId: 5,
  }
  if (isDev) {
    const user = await prisma.user.upsert({where: {email: data.email}, create: data, update: data})
  }
  return NextResponse.json({})
}
