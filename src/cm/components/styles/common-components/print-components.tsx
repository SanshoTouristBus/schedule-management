import React from 'react'

export const PrintSection = ({children}: {children: React.ReactNode}) => {
  return <div className={` print-section`}>{children}</div>
}

export const BreakBefore = () => {
  return <div className={`   break-before-all`}></div>
}
