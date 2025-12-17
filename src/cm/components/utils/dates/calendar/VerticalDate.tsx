import React from 'react'

export default function VerticalDate({date, days, currentMonth, content, style}) {
  const isInDifferentMonth = date?.getMonth() !== currentMonth?.getMonth()

  return (
    <div style={{width: `${100 / days?.length}%`, ...style}} className={`border ${isInDifferentMonth ? 'text-gray-400' : ''}`}>
      {content}
    </div>
  )
}
