import {Days} from '@cm/class/Days/Days'
import {formatDate} from '@cm/class/Days/date-utils/formatters'
import {anyObject} from '@cm/types/utility-types'
import {arr__uniqArray} from '@cm/class/ArrHandler/array-utils/basic-operations'
import {DH__switchColType} from '@cm/class/DataHandler/type-converter'

export class OrSearchArray {
  // 特定のオブジェクトから、ORを作成する
  static mapGetOrQuery({object, select}) {
    const resultOr: anyObject[] = []
    Object.keys(object).forEach(key => {
      const searchWord = object[key]
      if (key === `id`) return

      const OR = this.getOr({select, searchWord})
      resultOr.push(OR)
    })

    return resultOr.flat()
  }

  //検索文字から、ローマ字、全角、半角、大文字、小文字、カタカナ、ひらがなのバリエーションを取得
  static getLetterVariationArr(searchedWord) {
    const variations: {type: string; value: string}[] = []

    String(searchedWord)
      // eslint-disable-next-line no-irregular-whitespace
      .split(/\s|　/)
      .forEach(input => {
        // 半角から全角への変換
        const fullWidthInput = input.replace(/[A-Za-z0-9]/g, function (s) {
          return String.fromCharCode(s.charCodeAt(0) + 0xfee0)
        })

        // カタカナからひらがなへの変換
        const hiraganaInput = fullWidthInput.replace(/[\u30A1-\u30F6]/g, function (s) {
          return String.fromCharCode(s.charCodeAt(0) - 0x60)
        })

        // 全角から半角への変換
        const halfWidthInput = fullWidthInput.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
          return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
        })

        // ひらがなからカタカナへの変換
        const katakanaInput = hiraganaInput.replace(/[\u3041-\u3096]/g, function (s) {
          return String.fromCharCode(s.charCodeAt(0) + 0x60)
        })

        // 大文字から小文字への変換
        const lowercaseInput = input.toLowerCase()
        const lowercaseFullWidthInput = fullWidthInput.toLowerCase()

        // 小文字から大文字への変換
        const uppercaseInput = input.toUpperCase()

        const uppserCaseFullWidthInput = fullWidthInput.toUpperCase()

        // 全てのバリエーションを配列に追加
        const add = obj => {
          const {type, value} = obj
          if (obj.value === ``) return
          if (!variations.find(v => v.value === value)) {
            variations.push({type, value})
          }
        }

        add({type: `plane`, value: input})
        add({type: `hiraganaInput`, value: hiraganaInput})
        add({type: `katakanaInput`, value: katakanaInput})
        add({type: `fullWidthInput`, value: fullWidthInput})
        add({type: `halfWidthInput`, value: halfWidthInput})
        add({type: `lowercaseInput`, value: lowercaseInput})
        add({type: `lowercaseFullWidthInput`, value: lowercaseFullWidthInput})
        add({type: `uppercaseInput`, value: uppercaseInput})
        add({type: `uppserCaseFullWidthInput`, value: uppserCaseFullWidthInput})
      })

    const result = arr__uniqArray(variations)

    return result
  }

  //①与えられた型指定のselectと②検索文字から作成されたバリエーション配列から、ORを作成
  private static getOr({select, searchWord}) {
    const searchNotationVersions = this.getLetterVariationArr(searchWord)
    const OR: anyObject[] = []
    if (select) {
      Object.keys(select).forEach(key => {
        if (key === `id`) return //idはテキスト型のため

        const dataType = DH__switchColType({type: select[key]})

        //全角、半角、大文字、文字などをORで繋ぐ
        searchNotationVersions.forEach(possibleInputNotation => {
          const {value} = possibleInputNotation
          let object: any = {[key]: {contains: value}}

          if (dataType === `number`) {
            const ToNumber = Number(value)
            object = {[key]: {equals: isNaN(ToNumber) ? 0 : ToNumber}}
          } else if (dataType === `date`) {
            if (Days.validate.isDate(value)) {
              object = {[key]: {equals: formatDate(new Date(value), `iso`)}}
            } else {
              return
            }
          }

          OR.push(object)
        })
      })
    }

    return OR
  }
}
