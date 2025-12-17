import {useState, useEffect} from 'react'

// Hook to get the current cursor position
export type refreshPosition = `auto` | `manual`
const useCursorPosition = (props: {refreshPosition?: refreshPosition}) => {
  const {refreshPosition} = props ?? {}
  // State to store the cursor's position
  const [position, setPosition] = useState({x: 0, y: 0})

  const updatePosition = event => {
    setPosition({x: event.clientX, y: event.clientY})
  }

  // Effect to add event listeners for mouse movement
  useEffect(() => {
    if (refreshPosition === `auto`) {
      const updatePosition = event => {
        setPosition({x: event.clientX, y: event.clientY})
      }

      window.addEventListener('mousemove', updatePosition)
      return () => {
        window.removeEventListener('mousemove', updatePosition)
      }
    }
  }, []) // Empty dependency array ensures the effect runs only once
  return {cursorPosition: position, updatePosition}
}

export default useCursorPosition
