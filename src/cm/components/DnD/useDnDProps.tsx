import {DragEndEvent, DragStartEvent} from '@dnd-kit/core'
import {useState} from 'react'

const useInitDnD = () => {
  const [activeId, setActiveId] = useState<any>(null)

  const DragStartCallback: (event: DragStartEvent) => void = event => {
    const {
      active: {
        id,
        data,
        rect: {
          current: {initial, translated},
        },
      },
    } = event

    setActiveId(id)
  }

  type dragEndOptions = {
    cb: (event, DraggableItemPayload) => any
    onClick?: (event, DraggableItemPayload) => void
  }
  const handleDragEndCallback: (event: DragEndEvent, options: dragEndOptions) => void = (event, options) => {
    const {cb, onClick} = options
    const {activatorEvent, active, collisions, delta, over} = event
    const DraggableItemPayload = active.data.current
    const {x, y} = delta

    // const endPosition = event.pointer.coordinates
    const moveDistance = Math.sqrt(x + y)

    // 5pxより小さい移動はクリックと判断
    if (moveDistance < 5 && onClick) {
      onClick(event, DraggableItemPayload)

      return
    } else {
      cb(event, DraggableItemPayload)
    }

    setActiveId(null)
  }

  return {activeId, DragStartCallback, handleDragEndCallback}
}

export default useInitDnD
