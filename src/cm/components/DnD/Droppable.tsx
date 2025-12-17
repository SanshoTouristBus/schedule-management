import React from 'react'
import {useDroppable} from '@dnd-kit/core'

export default function Droppable(props) {
  const {id, style, ...elementProps} = props
  const {isOver, setNodeRef} = useDroppable({
    id: id,
  })

  const droppableStyle = {
    zIndex: -10,
    ...style,
  }

  return (
    <div
      ref={setNodeRef}
      {...elementProps}
      style={{
        ...(isOver ? {opacity: '20%', background: 'gray'} : {}),
      }}
    >
      <div style={droppableStyle}>{props.children}</div>
    </div>
  )
}
