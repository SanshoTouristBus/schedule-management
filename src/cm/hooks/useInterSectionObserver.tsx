import {useEffect, useRef} from 'react'

export default function useInterSectionObserver({callback, observerDeps}) {
  const ref = useRef(null)

  useEffect(() => {
    const options = {root: null, rootMargin: '0px', threshold: 1.0}
    const observer = new IntersectionObserver(handleObserver, options)
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => {
      observer.disconnect()
    }
  }, [ref.current, callback, ...observerDeps])

  const handleObserver = entities => {
    const target = entities[0]
    if (target.isIntersecting) {
      callback(ref)
    }
  }

  return {ref}
}
