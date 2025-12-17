import React from 'react'
import {useDraggable} from '@dnd-kit/core'
import {CSS} from '@dnd-kit/utilities'

export const Draggable = React.memo((props: any) => {
  const {id, data, ...elementProps} = props
  const {attributes, listeners, setNodeRef, transform, isDragging, node} = useDraggable({
    id: id,
    data: data,
  })

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        ...(isDragging ? {zIndex: 1000} : {zIndex: 0}),
      }
    : undefined

  const draggableDivProps = {
    style: style,
    ref: setNodeRef,
    ...listeners,
    ...attributes,
    ...elementProps,
  }

  return <div {...draggableDivProps}>{props.children}</div>
})
export default Draggable
