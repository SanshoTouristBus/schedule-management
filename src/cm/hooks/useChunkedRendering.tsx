import {useState, useEffect, useCallback, useRef} from 'react'

interface UseChunkedRenderingOptions {
  chunkSize: number
  delay: number // ms
  autoStart: boolean
}

export function useChunkedRendering<T>(data: T[], options: Partial<UseChunkedRenderingOptions> = {}) {
  const {
    chunkSize = 25,
    delay = 32, // ~30fps
    autoStart = true,
  } = options

  const [renderedData, setRenderedData] = useState<T[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isStarted, setIsStarted] = useState(false)

  // データの参照を保持して無限ループを防ぐ
  const dataRef = useRef<T[]>(data)
  const optionsRef = useRef(options)

  // データまたはオプションが変更された時のみ更新
  useEffect(() => {
    dataRef.current = data
    optionsRef.current = options
  })

  const startRendering = useCallback(() => {
    setRenderedData([])
    setCurrentIndex(0)
    setIsComplete(false)
    setIsStarted(true)
  }, [])

  const renderAll = useCallback(() => {
    const currentData = dataRef.current
    setRenderedData(currentData ? [...currentData] : [])
    setIsComplete(true)
    setCurrentIndex(currentData?.length || 0)
  }, [])

  // データが変更されたときの初期化（依存配列を最小限に）
  useEffect(() => {
    if (!data?.length) {
      setRenderedData([])
      setIsComplete(true)
      setIsStarted(false)
      return
    }

    if (autoStart) {
      // 直接状態を更新（startRenderingを呼ばない）
      setRenderedData([])
      setCurrentIndex(0)
      setIsComplete(false)
      setIsStarted(true)
    } else {
      setIsStarted(false)
      setIsComplete(false)
      setRenderedData([])
    }
  }, [data?.length, autoStart]) // dataの長さのみ監視

  // チャンクレンダリングの実行
  useEffect(() => {
    const currentData = dataRef.current

    if (!currentData?.length || isComplete || !isStarted) return

    const timer = setTimeout(() => {
      const nextChunk = currentData.slice(currentIndex, currentIndex + chunkSize)

      if (nextChunk.length > 0) {
        setRenderedData(prev => [...prev, ...nextChunk])
        setCurrentIndex(prev => prev + chunkSize)
      }

      if (currentIndex + chunkSize >= currentData.length) {
        setIsComplete(true)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [currentIndex, chunkSize, delay, isComplete, isStarted]) // dataを依存配列から除外

  const progress = data?.length ? Math.min(currentIndex / data.length, 1) : 1

  return {
    renderedData,
    isComplete,
    progress,
    startRendering,
    renderAll,
    totalCount: data?.length || 0,
    renderedCount: renderedData.length,
    isStarted,
  }
}
