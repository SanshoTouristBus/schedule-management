import useInterval from 'src/cm/hooks/useInterval'
import {useState} from 'react'

export const useLongPress = ({onClick, onLongPress, ms}) => {
  const checkInterval = 250
  const [pastMs, setpastMs] = useState<any>(null)
  const [event, setevent] = useState<any>(null)
  const isBeingPressed = pastMs !== null && pastMs < ms
  const pressedEnough = pastMs >= ms

  useInterval(() => {
    if (isBeingPressed) {
      setpastMs(prev => (prev ?? 0) + checkInterval)
      return
    } else if (pressedEnough) {
      onLongPress(event)
      setpastMs(null)
      return
    }
  }, checkInterval)

  const start = e => {
    setevent(e)
    setpastMs(25)
  }

  const stop = e => {
    if (pastMs === 25) {
      onClick(event)
    }
    setpastMs(null)
  }

  const handleLongPress = {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  }

  return {
    until: isBeingPressed ? ms - pastMs : undefined,
    event: isBeingPressed ? event : undefined,
    isBeingPressed,
    handleLongPress,
  }
}
