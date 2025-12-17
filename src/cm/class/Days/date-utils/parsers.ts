import {DateInput} from '@cm/class/Days/date-utils/date-utils-type'

// 日付オブジェクトから年月日時分秒の文字列を生成する。
export const getDate = (
  date: DateInput = new Date()
): {
  ymd: string | undefined
  hms: string | undefined
  templateCreate: {
    createYmd: string | undefined
    createHms: string | undefined
    updateYmd: string | undefined
    updateHms: string | undefined
  }
  templateUpdate: {
    updateYmd: string | undefined
    updateHms: string | undefined
  }
} => {
  if (!date) {
    return {
      ymd: undefined,
      hms: undefined,
      templateCreate: {createYmd: undefined, createHms: undefined, updateYmd: undefined, updateHms: undefined},
      templateUpdate: {updateYmd: undefined, updateHms: undefined},
    }
  }
  const toDateObj = new Date(date)

  // 無効な日付の場合の処理を追加すべき
  if (isNaN(toDateObj.getTime())) {
    return {
      ymd: undefined,
      hms: undefined,
      templateCreate: {createYmd: undefined, createHms: undefined, updateYmd: undefined, updateHms: undefined},
      templateUpdate: {updateYmd: undefined, updateHms: undefined},
    }
  }

  // YYYYMMDD形式の文字列を生成
  const ymd =
    String(toDateObj.getFullYear()) + //
    String(toDateObj.getMonth() + 1).padStart(2, '0') +
    String(toDateObj.getDate()).padStart(2, '0')

  // HHMMSS形式の文字列を生成
  const hms =
    String(toDateObj.getHours()).padStart(2, '0') +
    String(toDateObj.getMinutes()).padStart(2, '0') +
    String(toDateObj.getSeconds()).padStart(2, '0')

  return {
    ymd,
    hms,
    templateCreate: {createYmd: ymd, createHms: hms, updateYmd: ymd, updateHms: hms},
    templateUpdate: {updateYmd: ymd, updateHms: hms},
  }
}

// YYYYMMDD形式とHHMMSS形式の文字列からDateオブジェクトを生成
export const YmdToDate = (ymd?: string, hms?: string): Date | undefined => {
  // YYYYMMDD形式とHHMMSS形式の文字列を YYYY-MM-DD HH:MM:SS 形式に整形
  const parseDateStr = (ymd?: string, hms?: string) => {
    // 入力値の形式チェックを追加すべき
    if (ymd && !/^\d{8}$/.test(ymd)) {
      return ''
    }
    if (hms && !/^\d{6}$/.test(hms)) {
      return ''
    }

    const YMD = ymd ? ymd.slice(0, 4) + '-' + ymd.slice(4, 6) + '-' + ymd.slice(6, 8) : ''
    const HMS = hms ? hms.slice(0, 2) + ':' + hms.slice(2, 4) + ':' + hms.slice(4, 6) : ''
    const str = YMD + ' ' + HMS

    return str.trim() // 片方のパラメータのみの場合の余分なスペース除去
  }

  const str = parseDateStr(ymd, hms)
  if (str) {
    const date = new Date(str)
    // 無効な日付の場合はundefinedを返すべき
    return isNaN(date.getTime()) ? undefined : date
  }
  return undefined // 明示的にundefinedを返す
}

// 文字列から日付を解析する汎用関数
export const parseDate = (dateString: string): Date | null => {
  if (!dateString || typeof dateString !== 'string') return null

  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}

// ISO文字列から日付を解析
export const parseISODate = (isoString: string): Date | null => {
  if (!isoString) return null

  try {
    const date = new Date(isoString)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

// 日本語形式の日付文字列を解析
export const parseJapaneseDate = (japaneseDate: string): Date | null => {
  if (!japaneseDate) return null

  // 例: "2023年12月25日" -> "2023-12-25"
  const match = japaneseDate.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
  if (match) {
    const [, year, month, day] = match
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }

  return null
}
