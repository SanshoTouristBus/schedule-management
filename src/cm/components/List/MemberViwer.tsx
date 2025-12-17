'use client'

import {shorten} from 'src/cm/lib/methods/common'
import {CSSProperties} from 'react'

const MemberViwer = (props: {
  maxCount?: number
  items: any[]
  keys?: string[]
  style?: CSSProperties
  itemStyle?: CSSProperties
  shortenFrom?: number
}) => {
  const {items, keys = [], maxCount = 4, itemStyle = {width: 60}, style, shortenFrom = 5} = props
  if (!items) return <div>-</div>

  const itemWidth = (itemStyle?.width ?? 60) as number

  const numberOfItems = Math.min(items.length + 1, maxCount)
  const ulWidth = typeof itemStyle?.width === 'string' ? itemStyle?.width : numberOfItems * itemWidth + maxCount * 4

  return (
    <div style={style}>
      <div className={` flex w-full flex-wrap gap-1 `} style={{width: ulWidth}}>
        {items?.map((item, i) => {
          let value = item
          if (keys?.length > 0) {
            value = keys?.reduce((acc, key) => acc[key], item)
          }

          if (typeof value === 'string') {
            value = shorten(value, shortenFrom, '...')
          }

          return (
            <div
              key={i}
              className={`icon-btn   bg-sub-main text-white   hover:opacity-100 `}
              style={{width: itemWidth, padding: 2, ...itemStyle}}
            >
              {value}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MemberViwer
