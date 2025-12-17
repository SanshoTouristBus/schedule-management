// search route api

import {doTransaction} from '@cm/lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {NextRequest, NextResponse} from 'next/server'

export const POST = async (req: NextRequest) => {
  const body = await req.json()
  const {transactionQueryList} = body

  const result = await doTransaction({transactionQueryList})

  return NextResponse.json(result)
}
