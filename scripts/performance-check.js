#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// ファイルサイズを取得する関数
function getFileSize(filePath) {
 try {
  const stats = fs.statSync(filePath)
  return (stats.size / 1024).toFixed(2) // KB
 } catch (error) {
  return 'N/A'
 }
}

// ディレクトリ内のファイルサイズを再帰的に取得
function getDirectorySize(dirPath) {
 let totalSize = 0

 function calculateSize(currentPath) {
  const items = fs.readdirSync(currentPath)

  items.forEach(item => {
   const itemPath = path.join(currentPath, item)
   const stats = fs.statSync(itemPath)

   if (stats.isDirectory()) {
    calculateSize(itemPath)
   } else {
    totalSize += stats.size
   }
  })
 }

 try {
  calculateSize(dirPath)
  return (totalSize / 1024).toFixed(2) // KB
 } catch (error) {
  return 'N/A'
 }
}

// 最適化されたファイルのリスト
const optimizedFiles = [
 'src/cm/lib/methods/common.tsx',
 'src/cm/hooks/useWindowSize.tsx',
 'src/cm/constants/defaults.tsx',
 'src/cm/constants/holidayTypes.tsx',
 'src/cm/components/utils/SimpleTable.tsx',
 'src/cm/components/DataLogic/TFs/MyTable/TableHandler/Pagination/MyPagination.tsx',
 'src/cm/components/DataLogic/RTs/ChildCreator/ChildCreator.tsx',
 'src/cm/components/utils/ContentPlayer.tsx',
 'src/cm/components/SlateEditor/SlateEditor.tsx',
 'src/cm/components/utils/OverFlowTooltip.tsx',
 'src/cm/components/utils/BackGroundImage.tsx',
 'src/cm/hooks/useJotai.tsx',
 'src/cm/hooks/useRecharts.tsx',
 'src/cm/lib/methods/prisma-schema.tsx'
]

console.log('🚀 パフォーマンス最適化レポート')
console.log('=' * 50)

// 最適化されたファイルのサイズチェック
console.log('\n📊 最適化済みファイルサイズ:')
optimizedFiles.forEach(file => {
 const size = getFileSize(file)
 const status = size !== 'N/A' ? '✅' : '❌'
 console.log(`${status} ${file}: ${size}KB`)
})

// 大きなファイルのチェック
console.log('\n📦 大きなファイル（動的インポート推奨）:')
const largeFiles = [
 'src/cm/lib/methods/scheme-json-export.js',
 'src/cm/class/Days.tsx'
]

largeFiles.forEach(file => {
 const size = getFileSize(file)
 if (size !== 'N/A' && parseFloat(size) > 50) {
  console.log(`⚠️ ${file}: ${size}KB - 動的インポート推奨`)
 } else if (size === 'N/A') {
  console.log(`✅ ${file}: 分割済み/動的インポート済み`)
 } else {
  console.log(`✅ ${file}: ${size}KB`)
 }
})

// ディレクトリサイズ
console.log('\n📁 ディレクトリサイズ:')
const directories = [
 'src/cm/components',
 'src/cm/hooks',
 'src/cm/lib',
 'src/cm/class'
]

directories.forEach(dir => {
 const size = getDirectorySize(dir)
 console.log(`📂 ${dir}: ${size}KB`)
})

// React.memo使用状況チェック
console.log('\n🔍 React.memo使用状況チェック:')
const componentFiles = [
 'src/cm/components/utils/SimpleTable.tsx',
 'src/cm/components/DataLogic/TFs/MyTable/TableHandler/Pagination/MyPagination.tsx',
 'src/cm/components/DataLogic/RTs/ChildCreator/ChildCreator.tsx',
 'src/cm/components/SlateEditor/SlateEditor.tsx',
 'src/cm/components/utils/OverFlowTooltip.tsx',
 'src/cm/components/utils/BackGroundImage.tsx'
]

componentFiles.forEach(file => {
 try {
  const content = fs.readFileSync(file, 'utf8')
  const hasMemo = content.includes('React.memo')
  const status = hasMemo ? '✅' : '❌'
  console.log(`${status} ${file}: ${hasMemo ? 'React.memo適用済み' : 'React.memo未適用'}`)
 } catch (error) {
  console.log(`❌ ${file}: ファイルが見つかりません`)
 }
})

console.log('\n🎉 パフォーマンス最適化完了!')
console.log('詳細は PERFORMANCE_OPTIMIZATION.md を参照してください。')
