'use client'
import {useEffect, useState} from 'react'

// パフォーマンス測定用のフック
export const usePerformanceMonitor = (componentName: string) => {
  const [renderTime, setRenderTime] = useState<number>(0)
  const [renderCount, setRenderCount] = useState<number>(0)

  useEffect(() => {
    const startTime = performance.now()
    setRenderCount(prev => prev + 1)

    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      setRenderTime(duration)

      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 ${componentName} - Render #${renderCount + 1}: ${duration.toFixed(2)}ms`)
      }
    }
  })

  return {renderTime, renderCount}
}

// メモリ使用量監視
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<any>(null)

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        setMemoryInfo({
          usedJSHeapSize: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
          totalJSHeapSize: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
          jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2),
        })
      }
    }

    updateMemoryInfo()
    const interval = setInterval(updateMemoryInfo, 5000)

    return () => clearInterval(interval)
  }, [])

  return memoryInfo
}

// バンドルサイズ分析用
export const logBundleSize = (moduleName: string, moduleSize?: number) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📦 Bundle: ${moduleName} - ${moduleSize ? `${moduleSize}KB` : 'Dynamic Import'}`)
  }
}

// レンダリング最適化チェッカー
export const useRenderOptimizationChecker = (componentName: string, props: any) => {
  const [previousProps, setPreviousProps] = useState<any>(null)
  const [unnecessaryRenders, setUnnecessaryRenders] = useState<number>(0)

  useEffect(() => {
    if (previousProps) {
      const propsChanged = JSON.stringify(props) !== JSON.stringify(previousProps)
      if (!propsChanged) {
        setUnnecessaryRenders(prev => prev + 1)
        console.warn(`⚠️ ${componentName} - Unnecessary render #${unnecessaryRenders + 1}`)
      }
    }
    setPreviousProps(props)
  })

  return {unnecessaryRenders}
}

// パフォーマンス統計表示コンポーネント
export const PerformanceStats = () => {
  const memoryInfo = useMemoryMonitor()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        fontFamily: 'monospace',
      }}
    >
      <div>🚀 Performance Monitor</div>
      {memoryInfo && (
        <div>
          <div>Used: {memoryInfo.usedJSHeapSize}MB</div>
          <div>Total: {memoryInfo.totalJSHeapSize}MB</div>
          <div>Limit: {memoryInfo.jsHeapSizeLimit}MB</div>
        </div>
      )}
    </div>
  )
}
