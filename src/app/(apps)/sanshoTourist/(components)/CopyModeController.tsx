'use client'

import React from 'react'
import {Copy, Check} from 'lucide-react'
import {StScheduleWithRelations} from '../(server-actions)/schedule-actions'

type Props = {
  copySource: StScheduleWithRelations | null
  selectedTargetsCount: number
  onCancel: () => void
  onExecute: () => void
}

export const CopyModeController = ({copySource, selectedTargetsCount, onCancel, onExecute}: Props) => {
  if (!copySource) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 text-white p-4 z-50 flex justify-between items-center shadow-lg transform transition-transform">
      <div className="flex items-center">
        <Copy className="w-6 h-6 mr-3 text-yellow-400" />
        <div>
          <p className="font-bold text-lg">コピーモード中</p>
          <p className="text-sm text-gray-300">
            コピー元のデータ: {copySource.organizationName || '(未設定)'} ({copySource.destination || '未設定'})
          </p>
          <p className="text-sm text-gray-300">
            コピー先を選択してください: <span className="font-bold text-yellow-400">{selectedTargetsCount}</span> 箇所
          </p>
        </div>
      </div>
      <div className="flex space-x-4">
        <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium">
          キャンセル
        </button>
        <button
          onClick={onExecute}
          disabled={selectedTargetsCount === 0}
          className={`px-6 py-2 rounded-lg font-bold flex items-center ${
            selectedTargetsCount > 0 ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-gray-500 text-gray-300 cursor-not-allowed'
          }`}
        >
          <Check className="w-5 h-5 mr-2" />
          コピー実施
        </button>
      </div>
    </div>
  )
}

