'use client'

import React, { useState } from 'react'
import { Settings, Calendar, Save } from 'lucide-react'
import { StPublishSetting } from '@prisma/generated/prisma/client'

import useGlobal from '@cm/hooks/globalHooks/useGlobal'
import { updateStPublishSetting } from '../../(server-actions)/settings-actions'
import { formatDate } from '@cm/class/Days/date-utils/formatters'

type Props = {
  publishSetting: StPublishSetting | null
}



export const SettingsCC = ({ publishSetting }: Props) => {
  const { toggleLoad } = useGlobal()
  const [publishEndDate, setPublishEndDate] = useState(formatDate(publishSetting?.publishEndDate))
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await toggleLoad(async () => {
      await updateStPublishSetting({
        publishEndDate: publishEndDate ? new Date(publishEndDate) : null,
      })
    })
    setIsSaving(false)
    alert('保存しました')
  }

  const handleClear = async () => {
    if (!window.confirm('公開範囲設定をクリアしますか？（全ての日程が表示されるようになります）')) {
      return
    }
    setPublishEndDate('')
    await toggleLoad(async () => {
      await updateStPublishSetting({
        publishEndDate: null,
      })
    })
    alert('クリアしました')
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Settings className="w-6 h-6 mr-2" />
        公開範囲設定
      </h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            スケジュール公開終了日
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            設定した日付より先のスケジュールは、管理者以外のユーザーには非表示となります。
            <br />
            設定しない場合は、全てのスケジュールが表示されます。
          </p>

          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={publishEndDate}
              onChange={e => setPublishEndDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              disabled={!publishEndDate}
            >
              クリア
            </button>
          </div>

          {publishEndDate && (
            <p className="mt-2 text-sm text-indigo-600">
              {publishEndDate} 以降のスケジュールは、管理者以外に非表示になります。
            </p>
          )}
          {!publishEndDate && <p className="mt-2 text-sm text-gray-500">現在、全てのスケジュールが表示されています。</p>}
        </div>

        <div className="border-t pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? '保存中...' : '設定を保存'}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">権限について</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>
            <strong>管理者:</strong> 全てのスケジュールを閲覧可能、この設定を変更可能
          </li>
          <li>
            <strong>編集者:</strong> 公開範囲内のスケジュールを閲覧・編集可能
          </li>
          <li>
            <strong>閲覧者:</strong> 公開範囲内のスケジュールを閲覧のみ可能
          </li>
        </ul>
      </div>
    </div>
  )
}

