'use client'
import React from 'react'
import Loader from 'src/cm/components/utils/loader/Loader'

export default function Loading({children}) {
  return (
    <div>
      <Loader>Loading Server Data</Loader>
      {children}
    </div>
  )
}
