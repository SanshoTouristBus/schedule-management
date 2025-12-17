export const convert_GoogleURL_to_ID = (str: string): string => {
  // スプレッドシートのURLからIDを抽出
  const spreadsheetMatch = str.match(/\/d\/([a-zA-Z0-9-_]+)/)
  if (spreadsheetMatch) {
    return spreadsheetMatch[1]
  }

  // フォルダのURLからIDを抽出
  const folderMatch = str.match(/\/folders\/([a-zA-Z0-9-_]+)/)
  if (folderMatch) {
    return folderMatch[1]
  }

  const docMatch = str.match(/\/document\/([a-zA-Z0-9-_]+)/)
  if (docMatch) {
    return docMatch[1]
  }

  return str
}
