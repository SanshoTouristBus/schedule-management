import React from 'react'

export default function BoxDate({date, days, currentMonth, content}) {
  const isInDifferentMonth = date.getMonth() !== currentMonth.getMonth()

  return (
    <div style={{width: `${100 / 7}%`}} className={`border-2 ${isInDifferentMonth ? 'bg-gray-300' : ''}`}>
      {content}
    </div>
  )
}
