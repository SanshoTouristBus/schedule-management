// // フォームデータ分離専用モジュール
// import {SeparatedFormData, FormDataSeparationInput} from './types'
// import {Days} from '@cm/class/Days/Days'
// import {StrHandler} from '@cm/class/StrHandler'

// /**
//  * リレーションフィールドかどうかの判定
//  */
// export const isRelationalField = (key: string, value: any): boolean => {
//   const isNonDateObject = typeof value === 'object' && !Days.validate.isDate(value) && value !== null
//   const isRelationalId = key.includes('Id')
//   const startsWithCapital = StrHandler.startsWithCapital(key)

//   return isNonDateObject || isRelationalId || startsWithCapital
// }

// /**
//  * リレーションIDかどうかの判定（正規表現キャッシュ）
//  */
// export const isRelationId = (() => {
//   const regex = /.+Id$/
//   return (key: string): boolean => regex.test(key)
// })()
