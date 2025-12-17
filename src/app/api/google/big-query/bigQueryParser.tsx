import {toUtc} from '@cm/class/Days/date-utils/calculations'
import {sql} from '@cm/class/SqlBuilder/SqlBuilder'
export const BQ_parser = {
  castStrToDate: (col = 'DD_FR') => {
    const result = sql`
    CASE
    WHEN ${col} = '' THEN NULL
    WHEN ${col} = '0' THEN NULL
    WHEN ${col} IS NULL THEN NULL
    WHEN LENGTH(${col}) = 10 AND ${col} LIKE '%-%' AND ${col} NOT LIKE '% %' THEN PARSE_DATE('%Y-%m-%d', CAST(${col} AS STRING))  -- YYYY-MM-DD 形式の場合
    WHEN LENGTH(${col}) = 8 AND ${col} NOT LIKE '%-%' THEN PARSE_DATE('%Y%m%d', CAST(${col} AS STRING))  -- YYYYMMDD 形式の場合
    WHEN LENGTH(${col}) = 10 AND ${col} LIKE '%/%' AND ${col} NOT LIKE '% %' THEN PARSE_DATE('%Y/%m/%d', CAST(${col} AS STRING))  -- YYYY/MM/DD 形式の場合
    WHEN LENGTH(${col}) BETWEEN 8 AND 10 AND ${col} LIKE '%/%' AND ${col} NOT LIKE '% %' THEN SAFE.PARSE_DATE('%Y/%m/%d', CAST(${col} AS STRING)) -- YYYY/M/D 形式などの場合 (エラー回避のためSAFE.PARSE_DATEを使用)
    WHEN LENGTH(${col}) = 19 AND ${col} LIKE '%-%' AND ${col} LIKE '% %' THEN PARSE_DATE('%Y-%m-%d', CAST(SUBSTR(${col}, 1, 10) AS STRING))  -- TIMESTAMP 形式 (YYYY-MM-DD HH:MM:SS) の場合、日付部分だけ取得
    ELSE NULL
END`
    return result
  },

  parseDate: value => {
    if (value === undefined || value === `0` || value === `undefined`) return undefined

    if (value === null) {
      return null
    }

    if (typeof value === `object` && value?.[`value`]) {
      const result = toUtc(value[`value`])
      return result
    }

    return value

    // 日付オブジェクトかどうかを確認するヘルパー関数

    function isDate(value) {
      return Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)
    }

    // 正規表現マッチングを確認するヘルパー関数
    function regexMatch(value, pattern) {
      return new RegExp(pattern).test(value)
    }

    // 日付を文字列から作成するヘルパー関数
    function createDate(year, month, day) {
      return toUtc(new Date(year, month - 1, day))
    }

    if (isDate(value)) {
      return value
    } else {
      try {
        if (!regexMatch(value, '-')) {
          // 値が "-" を含まない場合
          const year = value.slice(0, 4)
          const month = value.slice(4, 6)
          const day = value.slice(6, 8)
          return createDate(year, month, day)
        } else {
          // "-" を含む場合
          return toUtc(new Date(value))
        }
      } catch (e) {
        return ''
      }
    }
  },
}
