import {mapAdjustOptionValue} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/lib/MySelectMethods-server'

import {apiPath} from 'src/cm/lib/methods/common'
import {useEffect, useState} from 'react'
import useSWR from 'swr'
import {fetchAlt} from '@cm/lib/http/fetch-client'

export const OptionsFromAutoFetch = ({CacheKeys, SWR_REQUEST_PARAMS, columns}) => {
  const isReady = Object.keys(SWR_REQUEST_PARAMS)?.length > 0
  const [Fetch_OP, setFetch_OP] = useState({})

  const {data, isValidating} = useSWR(CacheKeys?.Fetch_OP, async () => {
    return await switchOptions({SWR_REQUEST_PARAMS, columns})
  })

  useEffect(() => {
    if (data && isReady) {
      setFetch_OP(data)
    }
  }, [data])

  return Fetch_OP
}

const switchOptions = async ({SWR_REQUEST_PARAMS, columns}) => {
  const path = `${apiPath}/prisma/cacheSelectOptions`
  const data = await fetchAlt(path, {SWR_REQUEST_PARAMS, fetchKey: 'Fetch_OP'}, {revalidate: 30})
  Object.keys(data).forEach(colId => {
    let optionObjArr = data[colId]
    const col = columns.flat().find(col => col.id === colId)

    const nameChanger = col?.forSelect?.config?.nameChanger

    if (nameChanger) {
      optionObjArr = optionObjArr.map(op => nameChanger(op))
    }

    data[colId] = mapAdjustOptionValue(optionObjArr)
  })
  return data
}
