// // Tree Shaking対応のエントリーポイント

// // 型定義
// export type {BaseColTypes, ConvertDataOptions, SeparatedFormData, FormDataSeparationInput} from './types'

// // 軽量変換（よく使われる）
// export {
//   DH__switchColType,
//   DH__convertToNumber,
//   DH__convertToRating,
//   DH__convertToDate,
//   DH__convertToDateTime,
//   DH__convertToText,
//   DH__convertToArray,
//   DH__convertToBoolean,
//   DH__convertToJsonString,
//   DH__convertImplicitly,
//   DH__convertDataType,
// } from './type-converter'

// // フォーム分離

// // 後方互換性のためのレガシーエクスポート
// import {DH__convertDataType, DH__switchColType} from './type-converter'

// /**
//  * @deprecated 新しい個別関数を使用してください
//  * 後方互換性のために残されています
//  */
// export class DH {
//   static switchColType = ({type}: {type: string | undefined}) => DH__switchColType({type})

//   static convertDataType = (value: unknown, type?: string, convertFor?: string) => DH__convertDataType(value, type, convertFor)
// }
