import {useEffect, useState} from 'react'
import useGlobalOrigin from 'src/cm/hooks/globalHooks/useGlobalOrigin'
import {useJotaiByKey} from '@cm/hooks/useJotai'
import {isServer} from '@cm/lib/methods/common'
import {useGlobalPropType} from '@cm/hooks/globalHooks/useGlobal'

export default function useInitGlobalHooks() {
  const [globalPropsReady, setglobalPropsReady] = useState(false)
  const [globalHooks, setglobalHooks] = useJotaiByKey<useGlobalPropType | null>(`globalHooks`, null)

  const useGlobalProps = useGlobalOrigin()
  const deps = [
    ...useGlobalProps.useGlobalDeps,
    // ...useGlobalProps.useWindowSizeDeps,
    ...useGlobalProps.useLoaderDeps,
    ...useGlobalProps.useMyNavigationDependencies,
    ...useGlobalProps.useMySessionDependencies,
  ]

  useEffect(() => {
    if (useGlobalProps.sessionLoading || isServer) return
    setglobalHooks(useGlobalProps as any)
    setglobalPropsReady(true)
  }, deps)

  return {
    globalHooks,
    setglobalHooks,
    globalPropsReady,
  }
}
