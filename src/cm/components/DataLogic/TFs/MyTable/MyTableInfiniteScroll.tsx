import React, {useCallback, useEffect, useRef} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {EndMessage} from './components/MyTableControls/EndMessage'
import {LoadingComponent} from './components/MyTableControls/LoadingComponent'

interface MyTableInfiniteScrollProps {
  recordCount: number
  fetchNextPage: () => Promise<void>
  hasMore: boolean
  totalCount: number
  children: React.ReactNode
}

export const MyTableInfiniteScroll = React.memo<MyTableInfiniteScrollProps>(
  ({recordCount, fetchNextPage, hasMore, totalCount, children}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const isAutoLoadingRef = useRef(false)

    const LoadingComponentMemo = useCallback(() => <LoadingComponent />, [])
    const EndMessageMemo = useCallback(() => <EndMessage totalCount={totalCount} />, [totalCount])

    // 画面内に収まる場合の自動ロード機能
    const checkAndAutoLoad = useCallback(async () => {
      if (!containerRef.current || isAutoLoadingRef.current || !hasMore) return

      const container = containerRef.current
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight
      const windowHeight = window.innerHeight

      // コンテンツが表示領域より小さい場合、またはスクロールバーが表示されていない場合
      const needsAutoLoad =
        scrollHeight <= clientHeight ||
        scrollHeight <= windowHeight - 200 || // 200pxは余裕を持たせた値
        (container.scrollTop === 0 && scrollHeight - clientHeight <= 10) // スクロール可能量が非常に少ない場合

      if (needsAutoLoad && hasMore) {
        isAutoLoadingRef.current = true
        try {
          await fetchNextPage()
        } catch (error) {
          console.error('Error fetching next page:', error)
        } finally {
          // 少し遅延させてから次の自動ロードを許可
          setTimeout(() => {
            isAutoLoadingRef.current = false
          }, 300)
        }
      }
    }, [hasMore, fetchNextPage])

    // 初回レンダリング後とデータ変更時の自動ロード
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        checkAndAutoLoad()
      }, 100)

      return () => clearTimeout(timeoutId)
    }, [recordCount, checkAndAutoLoad])

    // ResizeObserverを使用してコンテナサイズの変更を監視
    useEffect(() => {
      if (!containerRef.current) return

      const resizeObserver = new ResizeObserver(() => {
        setTimeout(checkAndAutoLoad, 100)
      })

      resizeObserver.observe(containerRef.current)

      return () => {
        resizeObserver.disconnect()
      }
    }, [checkAndAutoLoad])

    return (
      <div ref={containerRef}>
        <InfiniteScroll
          dataLength={recordCount}
          next={fetchNextPage}
          hasMore={hasMore}
          loader={<LoadingComponentMemo />}
          endMessage={<EndMessageMemo />}
          style={{
            overflow: 'visible',
            minHeight: 'calc(100vh - 200px)', // 最小高度を設定してスクロール可能にする
          }}
          scrollThreshold={0.8}
          // 親要素でのスクロールを有効にする
          scrollableTarget={undefined}
        >
          {children}
        </InfiniteScroll>
      </div>
    )
  }
)

MyTableInfiniteScroll.displayName = 'MyTableInfiniteScroll'
