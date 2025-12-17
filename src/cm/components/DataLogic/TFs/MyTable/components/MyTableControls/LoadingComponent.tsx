import React from 'react'
export const LoadingComponent = React.memo(() => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    <span className="ml-2 text-sm">読み込み中...</span>
  </div>
))

LoadingComponent.displayName = 'LoadingComponent'
