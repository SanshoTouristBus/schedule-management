'use client'

import React, {useMemo} from 'react'
import {useChunkedRendering} from '@cm/hooks/useChunkedRendering'
import {R_Stack} from '@cm/components/styles/common-components/common-components'
import {createCsvTableCore, CsvTableProps} from './CsvTable'

/**
 * チャンク処理機能付きのクライアント専用CsvTable
 */
export const CsvTableChunked = (props: CsvTableProps) => {
  const chunkedOptions = props.chunked!

  // 🔥 チャンク処理対象のデータを取得
  const targetData = props.records || []

  // 🔥 オプションを安定化してレンダリングループを防ぐ
  const stableChunkedOptions = useMemo(
    () => ({
      chunkSize: chunkedOptions.chunkSize ?? 25,
      delay: chunkedOptions.delay ?? 32,
      autoStart: chunkedOptions.autoStart ?? true,
      showProgress: chunkedOptions.showProgress ?? true,
      showControls: chunkedOptions.showControls ?? false,
    }),
    [chunkedOptions.chunkSize, chunkedOptions.delay, chunkedOptions.autoStart]
  )

  const {renderedData, isComplete, progress, startRendering, renderAll, totalCount, renderedCount, isStarted} =
    useChunkedRendering(targetData, stableChunkedOptions)

  // 🔥 チャンク処理用のコントロールコンポーネント
  const ChunkControls = () => {
    if (!chunkedOptions.showControls) return null

    return (
      <div className="mb-3">
        <R_Stack className="items-center gap-2 mb-2">
          {!isStarted && (
            <button
              onClick={startRendering}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              段階的読み込み
            </button>
          )}
          {/* <button
            onClick={renderAll}
            className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            すべて表示
          </button> */}
          {/* <span className="text-xs text-gray-600">
            {renderedCount}/{totalCount}件表示中
          </span> */}
        </R_Stack>

        {chunkedOptions.showProgress && !isComplete && (
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{width: `${progress * 100}%`}} />
          </div>
        )}
      </div>
    )
  }

  // チャンク処理されたデータでCsvTableCoreを作成
  const csvTableCore = createCsvTableCore({
    ...props,
    records: renderedData,
  })

  // WithWrapperをカスタマイズしてChunkControlsを追加
  const WithWrapper = (wrapperProps: Parameters<typeof csvTableCore.WithWrapper>[0]) => {
    return (
      <div>
        <ChunkControls />
        {csvTableCore.WithWrapper(wrapperProps)}
      </div>
    )
  }

  return {
    ...csvTableCore,
    WithWrapper,
    // 🔥 チャンク処理の状態と制御関数を公開
    chunkedState: {
      isComplete,
      progress,
      renderedCount,
      totalCount,
      isStarted,
      startRendering,
      renderAll,
    },
  }
}
