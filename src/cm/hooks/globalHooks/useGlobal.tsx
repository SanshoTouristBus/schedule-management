export type useGlobalPropType = ReturnType<typeof useGlobalOrigin>

import {useGlobalContext} from '@cm/hooks/useGlobalContext/hooks/useGlobalContext'
import {atomTypes, useJotaiByKey} from '@cm/hooks/useJotai'
import useGlobalOrigin from 'src/cm/hooks/globalHooks/useGlobalOrigin'

export default function useGlobal(place?: any) {
  const globalContextMode = process.env.NEXT_PUBLIC_USE_JOTAI_GLOBAL !== 'false'
  if (globalContextMode) {
    return useGlobalContext()
  } else {
    const data = useJotaiByKey<atomTypes[`globalHooks`]>(`globalHooks`, null)
    const globalHooks = data[0] as useGlobalPropType
    return globalHooks
  }
}
