import {obj__initializeProperty} from '@cm/class/ObjHandler/transformers'
import {StrHandler} from '@cm/class/StrHandler'
import {prismaSchemaString, prismaDMMF} from '@cm/lib/methods/scheme-json-export'

/**
 * Prisma DMMF (Data Model Meta Format) の型定義
 */

/**
 * デフォルト値の型定義
 */
export type PrismaDMMFDefaultValue =
  | {
      name: 'autoincrement' | 'now' | 'uuid' | 'cuid' | 'dbgenerated'
      args: unknown[]
    }
  | boolean
  | number
  | string
  | null

/**
 * リレーション情報の型定義
 */
export type PrismaDMMFRelationInfo = {
  relationName: string
  relationFromFields: string[]
  relationToFields: string[]
  relationOnDelete?: 'Cascade' | 'Restrict' | 'NoAction' | 'SetNull' | 'SetDefault'
}

/**
 * スカラーフィールドの型定義
 */
export type PrismaDMMFScalarField = {
  name: string
  kind: 'scalar' | 'enum'
  isList: boolean
  isRequired: boolean
  isUnique: boolean
  isId: boolean
  isReadOnly: boolean
  hasDefaultValue: boolean
  type: string
  nativeType: string | null
  default?: PrismaDMMFDefaultValue
  isGenerated: boolean
  isUpdatedAt: boolean
}

/**
 * オブジェクト（リレーション）フィールドの型定義
 */
export type PrismaDMMFObjectField = {
  name: string
  kind: 'object'
  isList: boolean
  isRequired: boolean
  isUnique: boolean
  isId: boolean
  isReadOnly: boolean
  hasDefaultValue: boolean
  type: string
  nativeType: string | null
  relationName: string
  relationFromFields: string[]
  relationToFields: string[]
  relationOnDelete?: 'Cascade' | 'Restrict' | 'NoAction' | 'SetNull' | 'SetDefault'
  isGenerated: boolean
  isUpdatedAt: boolean
}

/**
 * フィールドのユニオン型
 */
export type PrismaDMMFField = PrismaDMMFScalarField | PrismaDMMFObjectField

/**
 * モデル構造の型定義
 */
export type PrismaDMMFModel = {
  name: string
  dbName: string | null
  schema: string | null
  fields: PrismaDMMFField[]
  primaryKey: {
    name: string | null
    fields: string[]
  } | null
  uniqueFields: string[][]
  uniqueIndexes: Array<{
    name: string
    fields: string[]
  }>
  isGenerated: boolean
}

/**
 * DMMF全体の型定義
 */
export type PrismaDMMF = {
  enums: Array<{
    name: string
    dbName: string | null
    values: Array<{
      name: string
      dbName: string | null
    }>
  }>
  models: PrismaDMMFModel[]
}

/**
 * モデル構造のみの型（ユーザーが提供したJSONの構造）
 */
export type ModelStructure = {
  modelStructure: PrismaDMMFModel
}

/**
 * Ucarモデル専用の型（オプション）
 */
export type UcarModelStructure = {
  modelStructure: PrismaDMMFModel & {
    name: 'Ucar'
  }
}

/**
 * @deprecated getDMMFModel() または modelExists() を使用してください
 * スキーマをオブジェクト形式で取得する
 * DMMFデータを使用した新しい実装
 */
export const getSchema = () => {
  const schemaAsObj = {}

  // DMMFが利用可能な場合はそちらを使用
  if (prismaDMMF && prismaDMMF.models) {
    prismaDMMF.models.forEach(model => {
      schemaAsObj[model.name] = model.fields.map(field => {
        // フィールド情報を文字列形式に変換（後方互換性のため）
        const isArray = field.isList ? '[]' : ''
        const isOptional = !field.isRequired ? '?' : ''
        return `  ${field.name}${isOptional} ${field.type}${isArray}`
      })
    })
    return schemaAsObj
  }

  // フォールバック: 従来の文字列解析方式
  const schemaAsStr = prismaSchemaString
  let modelName = ''
  schemaAsStr.split('\n').forEach(line => {
    if (line.includes('model') && line.includes('{')) {
      modelName = line.split(' ').filter(val => val)[1]
    }
    if (line.includes('}') || line.includes('{') || !line) {
      return
    }

    obj__initializeProperty(schemaAsObj, modelName, [])
    schemaAsObj[modelName].push(line)
  })

  return schemaAsObj
}

/**
 * @deprecated getRelationFields() を使用してください
 * リレーショナルモデルを取得する
 * DMMFデータを使用した改善版
 */
export const getRelationalModels = ({schemaAsObj, parentName}) => {
  parentName = parentName[0].toUpperCase() + parentName.slice(1)

  type attribute = {
    name: string
    type: string | null
    relationalType: string | null
  }

  const singleAttributeObj: {[key: string]: attribute} = {}
  const hasManyAttributeObj: {[key: string]: attribute} = {}
  const hasOneAttributeObj: {[key: string]: attribute} = {}

  // DMMFが利用可能な場合はそちらを使用
  if (prismaDMMF && prismaDMMF.models) {
    const model = prismaDMMF.models.find(m => m.name === parentName)

    if (model) {
      model.fields.forEach(field => {
        const {name, kind, type, isList, relationName} = field

        // リレーションフィールド（kind === 'object'）
        if (kind === 'object') {
          if (isList) {
            hasManyAttributeObj[name] = {name, type, relationalType: 'hasMany'}
          } else {
            hasOneAttributeObj[name] = {name, type, relationalType: 'hasOne'}
          }
        }
        // スカラーフィールド
        else if (kind === 'scalar' || kind === 'enum') {
          singleAttributeObj[name] = {name, type, relationalType: null}
        }
      })

      return {singleAttributeObj, hasManyAttributeObj, hasOneAttributeObj}
    }
  }

  // フォールバック: 従来の文字列解析方式
  const attributes = schemaAsObj[parentName]

  attributes?.forEach(line => {
    const foo = line.split(' ').filter(val => val)
    const [name, type] = foo

    if (String(name?.[0])?.match(/[A-Z]/)) {
      if (type.includes('[]')) {
        hasManyAttributeObj[name] = {name, type: null, relationalType: 'hasMany'}
      } else {
        hasOneAttributeObj[name] = {name, type: null, relationalType: 'hasOne'}
      }
    } else {
      singleAttributeObj[name] = {name, type, relationalType: null}
    }
  })

  return {singleAttributeObj, hasManyAttributeObj, hasOneAttributeObj}
}

/**
 * DMMFから直接モデル情報を取得するヘルパー関数
 */
export const getDMMFModel = (modelName: string) => {
  if (!prismaDMMF || !prismaDMMF.models) return null
  return prismaDMMF.models.find(m => m.name === StrHandler.capitalizeFirstLetter(modelName)) as PrismaDMMFModel | undefined
}

export const getModelFieldsInfomation = (modelName: string) => {
  const modelStructure = getDMMFModel(modelName)

  const objectFields: PrismaDMMFObjectField[] = []
  const primitiveFields: PrismaDMMFScalarField[] = []

  modelStructure?.fields?.forEach(field => {
    if (field.kind === 'object') {
      objectFields.push(field)
    } else {
      primitiveFields.push(field)
    }
  })

  const objectFieldObj: {[key: string]: PrismaDMMFObjectField} = {}
  const primitiveFieldObj: {[key: string]: PrismaDMMFScalarField} = {}

  objectFields.forEach(field => {
    objectFieldObj[field.name] = field
  })
  primitiveFields.forEach(field => {
    primitiveFieldObj[field.name] = field
  })

  return {primitiveFieldObj, objectFieldObj}
}

/**
 * モデルの存在確認
 */
export const modelExists = (modelName: string): boolean => getDMMFModel(modelName) !== undefined

/**
 * フィールドの存在確認
 */
export const hasField = (modelName: string, fieldName: string): boolean =>
  getDMMFModel(modelName)?.fields?.some(f => f.name === fieldName) ?? false

/**
 * リレーション情報を取得（hasManyとhasOneを区別）
 */
export const getRelationFields = (modelName: string) => {
  const model = getDMMFModel(modelName)
  if (!model) return {hasManyFields: {}, hasOneFields: {}}

  const hasManyFields: Record<string, PrismaDMMFObjectField> = {}
  const hasOneFields: Record<string, PrismaDMMFObjectField> = {}

  model.fields.forEach(field => {
    if (field.kind === 'object') {
      if (field.isList) {
        hasManyFields[field.name] = field as PrismaDMMFObjectField
      } else {
        hasOneFields[field.name] = field as PrismaDMMFObjectField
      }
    }
  })

  return {hasManyFields, hasOneFields}
}
