import {useState} from 'react'

export default function useOnKeyDown(key = 'Enter', callback) {
  const [isComposing, setIsComposing] = useState(false)

  const handleComposition = isStart => {
    setIsComposing(isStart)
  }

  const handleKeyDown = (e: any) => {
    if (!isComposing && e.key === key) {
      e.preventDefault()
      callback(e)
    }
  }

  const hook = {
    onKeyDown: handleKeyDown,
    onCompositionStart: () => handleComposition(true),
    onCompositionEnd: () => handleComposition(false),
  }
  return hook
}
