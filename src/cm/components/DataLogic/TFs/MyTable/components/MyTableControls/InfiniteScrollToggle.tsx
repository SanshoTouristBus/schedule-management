import React from 'react'

interface InfiniteScrollToggleProps {
  isInfiniteScrollMode: boolean
  setInfiniteScrollMode: (enabled: boolean) => void
}

export const InfiniteScrollToggle = React.memo<InfiniteScrollToggleProps>(({isInfiniteScrollMode, setInfiniteScrollMode}) => {
  return null
  return (
    <div className="flex items-center gap-2 px-2">
      <button
        onClick={() => setInfiniteScrollMode(!isInfiniteScrollMode)}
        className={`px-3 py-1 text-xs rounded transition-colors ${
          isInfiniteScrollMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {isInfiniteScrollMode ? '無限スクロール ON' : '無限スクロール OFF'}
      </button>
    </div>
  )
})

InfiniteScrollToggle.displayName = 'InfiniteScrollToggle'
