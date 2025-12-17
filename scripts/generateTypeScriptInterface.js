const startsWithCapital = key => /^[A-Z]+$/.test(key.slice(0, 1))
const getSchema = prismaSchemaString => {
  const schemaAsStr = prismaSchemaString
  const schemaAsObj = {}
  let modelName = ''
  schemaAsStr.split('\n').forEach(line => {
    if (line.includes('model') && line.includes('{')) {
      modelName = line.split(' ').filter(val => val)[1]
    }
    if (line.includes('}') || line.includes('{') || !line) {
      return
    }

    if (schemaAsObj[modelName] === undefined) {
      schemaAsObj[modelName] = []
    }
    schemaAsObj[modelName].push(line)
  })

  return schemaAsObj
}
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs')
const path = require('path')

// スキーマファイルのパスを指定
const schemaFilePath = `src/cm/lib/methods/scheme-json-export.js`

// スキーマファイルを読み込み
const prismaSchemaString = fs.readFileSync(schemaFilePath, 'utf8')

const scheme = getSchema(prismaSchemaString)

// モデル定義の正規表現パターン
// モデル定義の正規表現パターン
const modelPattern = /model\s+(\w+)\s*{([^}]*)}/g
// フィールドの正規表現パターンを修正して、フィールド名と型を正しく分離
const fieldPattern = /^\s*(\w+)\s+(\w+)(\[\])?\s*.*$/gm

// 型変換マッピング
const typeMapping = {
  Int: 'number',
  Float: 'number',
  Boolean: 'boolean',
  DateTime: 'Date',
  String: 'string',
  Json: 'any',
}

// 型生成用の関数
function generateTypeScriptInterfaces(schema) {
  let match
  let types = ''

  while ((match = modelPattern.exec(schema)) !== null) {
    let fieldCount = 0
    const modelName = 'P_' + match[1]
    const fields = match[2]
    // .replace(/@default(.+)/g, '');

    let typeDefinition = `export interface ${modelName} {\n`

    let fieldMatch

    while ((fieldMatch = fieldPattern.exec(fields)) !== null) {
      const fieldName = fieldMatch[1]
      let fieldType = fieldMatch[2]
      const isArray = fieldMatch[3]

      const relation = startsWithCapital(String(fieldName)) && Object.keys(scheme).find(modelName => modelName === fieldName)

      // 型をマッピングに基づいて変換
      fieldType = typeMapping[fieldType] || fieldType

      if (relation) {
        // リレーションフィールドの場合、関連するモデル名を使う
        fieldType = 'P_' + fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      }

      const newTypeDefinition = `  ${fieldName}: ${fieldType}${isArray ? '[]' : ''};\n`
      typeDefinition += newTypeDefinition
      fieldCount++
    }

    typeDefinition += '}\n\n'

    if (fieldCount > 0) {
      types += typeDefinition
    }
  }

  return types
}

// 型生成関数を実行してTypeScriptインターフェイスを生成
const types = generateTypeScriptInterfaces(prismaSchemaString)

// 生成されたTypeScript型をファイルに書き出し
const outputPath = path.join(__dirname, 'generatedTypes.ts')
fs.writeFileSync(outputPath, types, 'utf8')

console.log(`TypeScript types have been generated and saved to ${outputPath}`)
