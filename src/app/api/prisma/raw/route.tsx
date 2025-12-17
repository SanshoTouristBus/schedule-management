import {NextRequest, NextResponse} from 'next/server'
import {isRouteAccessAllowed} from '@app/api/prisma/isAllowed'
import {useRawSql} from '@cm/class/SqlBuilder/useRawSql'

export const POST = async (req: NextRequest) => {
  const body = await req.json()
  if (await isRouteAccessAllowed(req)) {
    const res = await useRawSql({sql: body.sql})

    return NextResponse.json(res)
  } else {
    return NextResponse.json({success: false, message: 'アクセスが禁止されています', result: null}, {status: 200})
  }
}
