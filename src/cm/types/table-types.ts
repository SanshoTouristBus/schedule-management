// // --- テーブル関連型 ---
// import {ClientPropsType2} from '@cm/components/DataLogic/TFs/PropAdjustor/types/propAdjustor-types'
// import type {anyObject} from './utility-types'
// import type {MyFormType} from './form-types'

// export type MyTableType =
//   | {
//       NoDataElement?: () => React.ReactNode
//       className?: string
//       configPosition?: 'popover' | 'top'
//       tableId?: string
//       style?: anyObject
//       create?: anyObject | boolean
//       delete?: anyObject | boolean | {allowByRecord: (props: {record: any}) => void}
//       update?: anyObject | boolean
//       search?: anyObject | boolean
//       sort?: anyObject | boolean
//       pagination?: {countPerPage?: number}
//       drag?: anyObject | boolean
//       header?: anyObject | boolean
//       AdditionalActionButtonObject?: {
//         [key: string]: (props: {record: any}) => React.ReactNode
//       }
//       fixedCols?: number
//       customActions?: (props: {ClientProps2: ClientPropsType2}) => React.ReactNode
//       showHeader?: boolean
//       showRecordIndex?: boolean
//       hideEasySearch?: boolean
//       useWrapperCard?: boolean
//     }
//   | undefined

// export type MyModalType = {
//   style?: React.CSSProperties
// }

// export type form_table_modal_config = {
//   myForm?: MyFormType
//   myTable?: MyTableType
//   myModal?: MyModalType
// }
