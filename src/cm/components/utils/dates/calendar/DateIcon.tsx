import React from 'react'

export default function DateIcon({date, children, span, className}) {
  const isToday = date?.toLocaleDateString() === new Date().toLocaleDateString()

  const badgeClass = !date ? '' : date && isToday ? 'bg-warning-main text-white' : ''
  return <span className={` m-1 rounded-xs  p-1  text-center  text-sm  font-bold ${badgeClass}`}>{children}</span>
}
