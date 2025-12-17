'use client'
import React, {createContext, useContext, ReactNode} from 'react'
import useLoader from '@cm/hooks/globalHooks/useLoader'
import {LoaderContextType} from './types'

const LoaderContext = createContext<LoaderContextType | null>(null)

const LoaderContextProvider = ({children}: {children: ReactNode}) => {
  const loaderData = useLoader()

  return <LoaderContext.Provider value={loaderData}>{children}</LoaderContext.Provider>
}

export function useLoaderContext() {
  const context = useContext(LoaderContext)
  if (!context) {
    throw new Error('useLoaderContext must be used within LoaderProvider')
  }
  return context
}

export default LoaderContextProvider
