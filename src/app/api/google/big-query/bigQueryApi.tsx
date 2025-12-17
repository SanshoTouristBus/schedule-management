'use server'

import {BQ} from '@app/api/google/big-query/BigQuery'

export const bigQuery__select = async (props: {datasetId: string; tableId: string; sqlString: any}) => {
  const {datasetId, tableId, sqlString} = props
  const {GET, SCHEMA} = await new BQ({datasetId, tableId})
  const res = await GET({sqlString})
  return res
  return {GET, SCHEMA}
}
