// 型定義
type StringInput = string | null | undefined

// 半角カナ→全角カナ変換マップ（メモ化対応）
const KANA_MAP = Object.freeze({
  // 濁音
  ｶﾞ: 'ガ',
  ｷﾞ: 'ギ',
  ｸﾞ: 'グ',
  ｹﾞ: 'ゲ',
  ｺﾞ: 'ゴ',
  ｻﾞ: 'ザ',
  ｼﾞ: 'ジ',
  ｽﾞ: 'ズ',
  ｾﾞ: 'ゼ',
  ｿﾞ: 'ゾ',
  ﾀﾞ: 'ダ',
  ﾁﾞ: 'ヂ',
  ﾂﾞ: 'ヅ',
  ﾃﾞ: 'デ',
  ﾄﾞ: 'ド',
  ﾊﾞ: 'バ',
  ﾋﾞ: 'ビ',
  ﾌﾞ: 'ブ',
  ﾍﾞ: 'ベ',
  ﾎﾞ: 'ボ',
  // 半濁音
  ﾊﾟ: 'パ',
  ﾋﾟ: 'ピ',
  ﾌﾟ: 'プ',
  ﾍﾟ: 'ペ',
  ﾎﾟ: 'ポ',
  // その他
  ｳﾞ: 'ヴ',
  ﾜﾞ: 'ヷ',
  ｦﾞ: 'ヺ',
  // 基本カナ
  ｱ: 'ア',
  ｲ: 'イ',
  ｳ: 'ウ',
  ｴ: 'エ',
  ｵ: 'オ',
  ｶ: 'カ',
  ｷ: 'キ',
  ｸ: 'ク',
  ｹ: 'ケ',
  ｺ: 'コ',
  ｻ: 'サ',
  ｼ: 'シ',
  ｽ: 'ス',
  ｾ: 'セ',
  ｿ: 'ソ',
  ﾀ: 'タ',
  ﾁ: 'チ',
  ﾂ: 'ツ',
  ﾃ: 'テ',
  ﾄ: 'ト',
  ﾅ: 'ナ',
  ﾆ: 'ニ',
  ﾇ: 'ヌ',
  ﾈ: 'ネ',
  ﾉ: 'ノ',
  ﾊ: 'ハ',
  ﾋ: 'ヒ',
  ﾌ: 'フ',
  ﾍ: 'ヘ',
  ﾎ: 'ホ',
  ﾏ: 'マ',
  ﾐ: 'ミ',
  ﾑ: 'ム',
  ﾒ: 'メ',
  ﾓ: 'モ',
  ﾔ: 'ヤ',
  ﾕ: 'ユ',
  ﾖ: 'ヨ',
  ﾗ: 'ラ',
  ﾘ: 'リ',
  ﾙ: 'ル',
  ﾚ: 'レ',
  ﾛ: 'ロ',
  ﾜ: 'ワ',
  ｦ: 'ヲ',
  ﾝ: 'ン',
  // 小文字
  ｧ: 'ァ',
  ｨ: 'ィ',
  ｩ: 'ゥ',
  ｪ: 'ェ',
  ｫ: 'ォ',
  ｯ: 'ッ',
  ｬ: 'ャ',
  ｭ: 'ュ',
  ｮ: 'ョ',
  // 記号
  '｡': '。',
  '､': '、',
  ｰ: 'ー',
  '｢': '「',
  '｣': '」',
  '･': '・',
} as const)

// 正規表現のキャッシュ（パフォーマンス最適化）
const KANA_REGEX = new RegExp('(' + Object.keys(KANA_MAP).join('|') + ')', 'g')
const CAPITAL_REGEX = /^[A-Z]$/
const DAKUTEN_REGEX = /ﾞ/g
const HANDAKUTEN_REGEX = /ﾟ/g

// ユーティリティ関数
const isValidString = (value: any): value is string => {
  return typeof value === 'string'
}

const isEmptyString = (value: string): boolean => {
  return value.length === 0
}

export class StrHandler {
  /**
   * 文字列の最初の文字を大文字に変換（型安全性向上）
   */
  static capitalizeFirstLetter = (str: StringInput): string => {
    if (!isValidString(str) || isEmptyString(str)) {
      return str as string
    }

    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  /**
   * 文字列の最初の文字を小文字に変換（型安全性向上）
   */
  static lowerCaseFirstLetter = (str: StringInput): string => {
    if (!isValidString(str) || isEmptyString(str)) {
      return str as string
    }

    return str.charAt(0).toLowerCase() + str.slice(1)
  }

  /**
   * 文字列が大文字で始まるかチェック（最適化）
   */
  static startsWithCapital = (key: StringInput): boolean => {
    if (!isValidString(key) || isEmptyString(key)) {
      return false
    }

    const firstChar = key.charAt(0)
    return CAPITAL_REGEX.test(firstChar) && isNaN(Number(firstChar))
  }

  /**
   * 半角カナを全角カナに変換（パフォーマンス最適化）
   */
  static hankana2Zenkana = (str: StringInput): string => {
    if (!isValidString(str)) {
      return str ?? ''
    }

    if (isEmptyString(str)) {
      return str
    }

    try {
      return str
        .replace(KANA_REGEX, match => KANA_MAP[match as keyof typeof KANA_MAP] || match)
        .replace(DAKUTEN_REGEX, '゛')
        .replace(HANDAKUTEN_REGEX, '゜')
    } catch (error) {
      console.error('Error in hankana2Zenkana:', error)
      return str
    }
  }

  /**
   * 文字列をトリム（null安全）
   */
  static safeTrim = (str: StringInput): string => {
    if (!isValidString(str)) {
      return ''
    }
    return str.trim()
  }

  /**
   * 文字列が空かチェック（null安全）
   */
  static isEmpty = (str: StringInput): boolean => {
    return !isValidString(str) || isEmptyString(str.trim())
  }

  /**
   * 文字列の長さを安全に取得
   */
  static safeLength = (str: StringInput): number => {
    if (!isValidString(str)) {
      return 0
    }
    return str.length
  }

  /**
   * 文字列を指定文字数で切り詰め
   */
  static truncate = (str: StringInput, maxLength: number, suffix: string = '...'): string => {
    if (!isValidString(str)) {
      return ''
    }

    if (maxLength <= 0) {
      return ''
    }

    if (str.length <= maxLength) {
      return str
    }

    const truncatedLength = Math.max(0, maxLength - suffix.length)
    return str.slice(0, truncatedLength) + suffix
  }

  /**
   * 文字列をケバブケースに変換
   */
  static toKebabCase = (str: StringInput): string => {
    if (!isValidString(str)) {
      return ''
    }

    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase()
  }

  /**
   * 文字列をキャメルケースに変換
   */
  static toCamelCase = (str: StringInput): string => {
    if (!isValidString(str)) {
      return ''
    }

    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
      .replace(/^[A-Z]/, char => char.toLowerCase())
  }

  /**
   * 文字列をパスカルケースに変換
   */
  static toPascalCase = (str: StringInput): string => {
    const camelCase = StrHandler.toCamelCase(str)
    return StrHandler.capitalizeFirstLetter(camelCase)
  }

  /**
   * 文字列内の連続する空白を単一の空白に変換
   */
  static normalizeWhitespace = (str: StringInput): string => {
    if (!isValidString(str)) {
      return ''
    }

    return str.replace(/\s+/g, ' ').trim()
  }

  /**
   * 文字列から数字のみを抽出
   */
  static extractNumbers = (str: StringInput): string => {
    if (!isValidString(str)) {
      return ''
    }

    return str.replace(/[^0-9]/g, '')
  }

  /**
   * 文字列から英字のみを抽出
   */
  static extractAlphabets = (str: StringInput): string => {
    if (!isValidString(str)) {
      return ''
    }

    return str.replace(/[^a-zA-Z]/g, '')
  }

  /**
   * 文字列が数字のみかチェック
   */
  static isNumericOnly = (str: StringInput): boolean => {
    if (!isValidString(str) || isEmptyString(str)) {
      return false
    }

    return /^\d+$/.test(str)
  }

  /**
   * 文字列が英字のみかチェック
   */
  static isAlphabetOnly = (str: StringInput): boolean => {
    if (!isValidString(str) || isEmptyString(str)) {
      return false
    }

    return /^[a-zA-Z]+$/.test(str)
  }

  /**
   * 文字列が英数字のみかチェック
   */
  static isAlphanumericOnly = (str: StringInput): boolean => {
    if (!isValidString(str) || isEmptyString(str)) {
      return false
    }

    return /^[a-zA-Z0-9]+$/.test(str)
  }
}

// 型エクスポート
export type {StringInput}
