import {useEffect, useRef, useState} from 'react'

export const useInterval = (fn, interval, autostart = true) => {
  const [count, setcount] = useState(0)
  const onUpdateRef = useRef<any>(null)
  const [state, setState] = useState('STOPPED')
  const start = () => {
    setState('RUNNING')
  }
  const stop = () => {
    setState('STOPPED')
  }

  useEffect(() => {
    onUpdateRef.current = fn
  }, [fn])

  useEffect(() => {
    if (autostart) {
      setState('RUNNING')
    }
  }, [autostart])

  useEffect(() => {
    if (interval === null) return
    let timerId
    if (state === 'RUNNING') {
      timerId = setInterval(() => {
        const next = count + 1
        setcount(prev => {
          const next = prev + 1
          return next
        })
        console.info(`${interval / 1000} 秒 interval ${next}回目`)
        onUpdateRef.current?.()
      }, interval)
    } else {
      timerId && clearInterval(timerId)
    }
    return () => {
      timerId && clearInterval(timerId)
    }
  }, [interval, state, count])
  return [state, {start, stop}]
}

export default useInterval
