export function findDuplicateKeys(...objects) {
  // キーとその所属元オブジェクト名を記録するマップ
  const keyMap = new Map()

  // 各オブジェクトについて処理
  objects.forEach((obj, index) => {
    Object.keys(obj).forEach(key => {
      if (!keyMap.has(key)) {
        // キーがまだ登録されていなければ、新しく配列を作成して登録
        keyMap.set(key, [])
      }
      // キーの存在するオブジェクト名（ここではインデックス）を記録
      keyMap.get(key).push(`object${index + 1}`)
    })
  })

  // 重複しているキーとその所属元オブジェクト名を出力
  console.warn(`checkを始めます`)
  keyMap.forEach((value, key) => {
    if (value.length > 1) {
      console.info(`キー "${key}" in  ${value.join(', ')}`)
    }
  })
}
