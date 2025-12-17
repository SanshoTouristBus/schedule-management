import {NextRequest, NextResponse} from 'next/server'
import {BQ} from '@app/api/google/big-query/BigQuery'
import {bigQuerySqlArgs} from '@app/api/google/big-query/big-query-types'

export type BigQueryApiPostBody = {
  datasetId: string
  tableId: string
  method: `SCHEMA` | `GET` | `common`
  args?: bigQuerySqlArgs
}
export const POST = async (req: NextRequest) => {
  const body: BigQueryApiPostBody = await req.json()

  const {datasetId, tableId, method, args} = body

  const BQ_INSTANCE = new BQ({datasetId, tableId})
  const res = await BQ_INSTANCE[method]?.(args ?? {})

  return NextResponse.json(res)
}
