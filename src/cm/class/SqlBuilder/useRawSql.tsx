'use server'
import {Pool} from 'pg'
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // 必要なら設定を調整
})

export const useRawSql = async ({sql}) => {
  const client = await pool.connect()

  try {
    const result = (await client.query(sql)) as {
      rows: any[]
      rowCount: number
      command: string
      oid: number
      fields: {
        name: string
        tableID: number
        columnID: number
        dataTypeID: number
        dataTypeSize: number
        dataTypeModifier: number
        format: string
      }
    }

    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  } finally {
    client.release() // プールに接続を返す
  }
}

export type sqlResponse = {
  rows: any[]
  rowCount: number
  command: string
  oid: number
  fields: {
    name: string
    tableID: number
    columnID: number
    dataTypeID: number
    dataTypeSize: number
    dataTypeModifier: number
    format: string
  }
}
