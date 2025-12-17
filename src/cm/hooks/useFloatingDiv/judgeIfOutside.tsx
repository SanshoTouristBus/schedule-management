export const judgeIfOutside = ({ref, childRef, newPosition}) => {
  const windowOffset = 10

  if (ref.current && childRef.current) {
    const elementWidth = childRef.current.offsetWidth
    const elementHeight = childRef.current.offsetHeight

    const {x: itemX, y: itemY} = ref.current.getBoundingClientRect()
    const moveBackPositoin = {...newPosition}
    let outsideDirection: any = null

    if (newPosition.x < windowOffset) {
      moveBackPositoin.x = windowOffset
      outsideDirection = 'left'
    }

    if (newPosition.x + elementWidth > window.innerWidth + windowOffset) {
      moveBackPositoin.x = window.innerWidth - windowOffset - elementWidth
      outsideDirection = 'right'
    }

    if (newPosition.y < windowOffset) {
      moveBackPositoin.y = windowOffset
      outsideDirection = 'top'
    }

    if (newPosition.y + elementHeight > window.innerHeight + windowOffset) {
      moveBackPositoin.y = window.innerHeight - windowOffset - elementHeight
      outsideDirection = 'bottom'
    }

    if (outsideDirection) {
      console.log(newPosition, outsideDirection, moveBackPositoin)
      return moveBackPositoin
    }
  }
  return null
}
