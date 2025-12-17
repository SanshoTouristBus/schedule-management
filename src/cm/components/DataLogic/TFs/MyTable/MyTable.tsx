'use client'
import React from 'react'
import {ClientPropsType2} from '@cm/components/DataLogic/TFs/PropAdjustor/types/propAdjustor-types'
import {UseRecordsReturn} from '@cm/components/DataLogic/TFs/PropAdjustor/hooks/useRecords/useRecords'

import {useMyTableLogic} from './hooks/useMyTableLogic'

import {MainTable} from './components/MainTable/MainTable'

// 型定義
export interface MyTableProps {
  ClientProps2: ClientPropsType2 & {
    UseRecordsReturn?: UseRecordsReturn
  }
}

export type UseMyTableLogicReturn = ReturnType<typeof useMyTableLogic>

const MyTable = React.memo<MyTableProps>(props => {
  // 🔧 ロジックを分離したカスタムフックを使用（1回だけ呼ぶ）
  const useMyTableLogicReturn = useMyTableLogic(props)
  const {Components} = useMyTableLogicReturn

  const TABLE_CONTROL_POSITION = process.env.NEXT_PUBLIC_TABLE_CONTROL_POSITION || 'top'

  return (
    <div>
      {/* 検索モーダル */}
      {Components.SearchModalMemo}

      {/* テーブル */}
      <div className={` relative `}>
        {TABLE_CONTROL_POSITION === 'top' && <Components.MyTableControlsCallback />}
        <div style={{maxHeight: useMyTableLogicReturn.mainTableProps.tableStyle.maxHeight}}>
          {/* useMyTableLogicReturnをMainTableに渡して二重呼び出しを防ぐ */}
          <MainTable {...props} useMyTableLogicReturn={useMyTableLogicReturn} />
          <div className={` sticky w-full mx-auto bottom-0     z-10 `}>
            {TABLE_CONTROL_POSITION === 'bottom' && <Components.MyTableControlsCallback />}
          </div>
        </div>
      </div>
    </div>
  )
})

MyTable.displayName = 'MyTable'

export default MyTable
