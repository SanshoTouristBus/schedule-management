// 'use client'

// import React from 'react'

// import {colType} from '@cm/types/col-types'
// import InlineEditableValue from '@cm/components/DataLogic/TFs/MyTable/components/MainTable/TdContent/InlineEditableValue'
// import {getValue} from '@cm/components/DataLogic/TFs/MyTable/components/MainTable/TdContent/lib/getValue'
// import {UseRecordsReturn} from '@cm/components/DataLogic/TFs/PropAdjustor/hooks/useRecords/useRecords'

// export type UseEditableCellProps = {
//   record: any
//   col: colType
//   dataModelName: string
//   UseRecordsReturn: UseRecordsReturn
//   tdStyle?: React.CSSProperties
// }

// const useEditableCell = (props: UseEditableCellProps) => {
//   const {record, col, dataModelName, UseRecordsReturn, tdStyle} = props

//   if (!col.td?.editable) {
//     return {
//       isEditable: false,
//       InlineEditor: null,
//     }
//   }

//   // 表示用の値を取得
//   const displayValue = getValue({col, record, dataModelName, tdStyle})

//   // InlineEditableValueコンポーネントを返す
//   const InlineEditor = (
//     <InlineEditableValue
//       col={col}
//       record={record}
//       displayValue={displayValue}
//       dataModelName={dataModelName}
//       UseRecordsReturn={UseRecordsReturn}
//     />
//   )

//   return {
//     isEditable: true,
//     InlineEditor,
//   }
// }

// export default useEditableCell
