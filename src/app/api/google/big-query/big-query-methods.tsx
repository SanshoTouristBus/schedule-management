'use server'
import {bigQuerySqlArgs, bigQuerytableConfig, bigQueryWhere} from '@app/api/google/big-query/big-query-types'
import {anyObject} from '@cm/types/utility-types'
import {BigQuery} from '@google-cloud/bigquery'

const bigquery = new BigQuery()
export const getBigQueryClient = async () => {
  return bigquery
}

export const handleBigQuery = async (props: bigQuerytableConfig) => {
  const {datasetId, tableId} = props

  const getSchema = async () => {
    'use server'
    const dataset = await bigquery.dataset(datasetId)
    const table = await dataset.table(tableId)
    const metadata = await table.getMetadata()
    const schema = metadata?.[0]?.schema
    const {fields} = schema

    const summary = schema.fields.map(d => {
      const {name, type, description} = d
      return {name, type, description}
    })
    return {dataset, table, fields, summary}
  }

  const builderQuery = async (props: bigQuerySqlArgs) => {
    'use server'
    const {selects, where, limit, rawWhere, offset} = props
    const datasetAndTable = `${datasetId}.${tableId}`
    let query = `select * `
    if (selects) {
      query = `select ${selects} `
    }
    query += `from ${datasetAndTable} `

    if (rawWhere) {
      query += `where ${rawWhere} `
    } else if (where) {
      query += `where `

      where.forEach((entry: bigQueryWhere, idx) => {
        const {key, operator = `=`, type = `STRING`} = entry
        let value = entry.value
        if (type === `STRING`) {
          value = `'${value}'`
        }
        query += `${key} ${operator} ${value}`
        if (idx !== where.length - 1) {
          query += ` and `
        }
      })
    }

    if (limit) {
      query += ` LIMIT  ${limit}`
    }
    if (offset) {
      query += ` OFFSET  ${offset}`
    }

    return (query += ';')
  }
  const get = async (props: bigQuerySqlArgs) => {
    'use server'
    const {selects, where, limit, rawWhere} = props
    const bigquery = new BigQuery({})

    const query = await builderQuery({selects, where, limit, rawWhere})

    const rows = (await bigquery.query(query)) as anyObject[][]

    const count = rows[0].length
    console.debug(`${count} rows returned`)
    return rows
  }

  return {builderQuery, get, getSchema}
}
