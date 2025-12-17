import React from 'react'

interface EndMessageProps {
  totalCount: number
}

export const EndMessage = React.memo<EndMessageProps>(({totalCount}) => (
  <div className="text-center py-4 text-gray-500">
    <p className="text-sm">全てのデータを表示しました ({totalCount.toLocaleString()}件)</p>
  </div>
))

EndMessage.displayName = 'EndMessage'
