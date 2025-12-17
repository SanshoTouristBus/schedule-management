'use client'
import React, {createContext, useContext, ReactNode} from 'react'
import useMyNavigation from '@cm/hooks/globalHooks/useMyNavigation'
import {NavigationContextType} from './types'
import Loader from '@cm/components/utils/loader/Loader'
import Redirector from '@cm/components/utils/Redirector'

const NavigationContext = createContext<NavigationContextType | null>(null)

const NavigationContextProvider = ({children}: {children: ReactNode}) => {
  const navigationData = useMyNavigation()
  const {pathname} = navigationData

  if (navigationData.query === null || navigationData.query === undefined) {
    return <Loader>Validating Navigation Data</Loader>
  }

  if (pathname === `/` && process.env.NEXT_PUBLIC_DEFAULT_REDIRECT_PATH) {
    return <Redirector redirectPath={`/${process.env.NEXT_PUBLIC_DEFAULT_REDIRECT_PATH}`} />
  }

  return <NavigationContext.Provider value={navigationData}>{children}</NavigationContext.Provider>
}

export function useNavigationContext() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationProvider')
  }
  return context
}

export default NavigationContextProvider
