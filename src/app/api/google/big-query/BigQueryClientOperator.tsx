import {BigQueryApiPostBody} from '@app/api/google/big-query/route'
import {fetchAlt} from '@cm/lib/http/fetch-client'

import {apiPath} from '@cm/lib/methods/common'

export const fetchBigQuery = async (body: BigQueryApiPostBody) => {
  const res = await fetchAlt(`${apiPath}/google/big-query`, body)

  return res
}
