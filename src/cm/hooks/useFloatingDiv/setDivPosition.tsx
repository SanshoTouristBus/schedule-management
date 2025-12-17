export const setDivPosition = ({newPosition, ref, setPosition}) => {
  if (ref.current) {
    ref.current.style.left = `${newPosition.x}px`
    ref.current.style.top = `${newPosition.y}px`

    setPosition(newPosition)
    localStorage.setItem('dragPosition', JSON.stringify(newPosition))
  }
}
