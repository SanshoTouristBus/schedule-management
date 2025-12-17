'use client'
import useMySession from '@cm/hooks/globalHooks/useMySession'
import useMyNavigation from 'src/cm/hooks/globalHooks/useMyNavigation'

import useLoader from 'src/cm/hooks/globalHooks/useLoader'

export type useGlobalPropType = ReturnType<typeof useGlobalOrigin>

export default function useGlobalOrigin(place?: any) {
  type useMyNavigationHookType = ReturnType<typeof useMyNavigation>
  type useMySessionHookType = ReturnType<typeof useMySession>
  type loadingHookType = ReturnType<typeof useLoader>

  const useMyNavigationHook: useMyNavigationHookType = useMyNavigation() ?? {}
  const useMySessionHook: useMySessionHookType = useMySession() ?? {}
  const loading: loadingHookType = useLoader()

  const result = {
    ...useMyNavigationHook,
    ...useMySessionHook,
    ...loading,
  }

  const {globalLoaderAtom, status, session} = result

  const waitRendering = [
    status === `loading`,
    useMySessionHook.sessionLoading,
    useMyNavigationHook.query === null,
    useMyNavigationHook.query === undefined,
    typeof window === `undefined`,
    !session,
    // width === 0,
    // !device,
  ].some(Boolean)

  const showLoader = waitRendering || globalLoaderAtom

  const useGlobalDeps = [waitRendering, showLoader]

  return {...result, waitRendering, showLoader, useGlobalDeps}
}
