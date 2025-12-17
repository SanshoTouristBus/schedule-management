import {bgDataSet, bigQuerySqlArgs, bigQueryWhere, bqTable} from '@app/api/google/big-query/big-query-types'
import {anyObject} from '@cm/types/utility-types'
import {BigQuery} from '@google-cloud/bigquery'
export class BQ {
  datasetId
  tableId
  constructor({datasetId, tableId}) {
    this.datasetId = datasetId
    this.tableId = tableId
  }

  static getBigQueryClient = () => {
    const credentials = JSON.parse(process.env.GOOGLE_BIGQUERY_API_SERVICE_ACCOUNT_CREDENTIALS ?? '')
    const client = new BigQuery({credentials})
    return client
  }

  common = () => {
    const getDatasets = async () => {
      const bigQuery = BQ.getBigQueryClient()
      const datasets = await bigQuery.getDatasets()
      return datasets.flat() as bgDataSet[]
    }
    const getTables = async () => {
      const datasets = await getDatasets()
      let allTables: bqTable[] = []
      await Promise.all(
        datasets.map(async (dataset: bgDataSet) => {
          const {id} = dataset
          let tables = await dataset.getTables()
          tables = tables[0].map(d => d?.metadata) as bqTable[]
          allTables = [...allTables, ...tables]
        })
      )
      return allTables
    }

    return {getDatasets, getTables}
  }

  SCHEMA = async () => {
    const bigQuery = BQ.getBigQueryClient()
    const dataset = await bigQuery.dataset(this.datasetId)
    const table = await dataset.table(this.tableId)
    const metadata = await table.getMetadata()
    const schema = metadata?.[0]?.schema
    const {fields} = schema
    const summary = schema.fields.map(d => {
      const {name, type, description} = d
      return {name, type, description}
    })
    return {dataset, table, fields, summary}
  }
  GET = async (props: bigQuerySqlArgs) => {
    // ビルダー関数
    const builderQuery = async (props: bigQuerySqlArgs) => {
      const {selects, where, limit, rawWhere, offset, orderBy, sqlString} = props

      const datasetAndTable = `${this.datasetId}.${this.tableId}`
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

      if (orderBy && orderBy.length > 0) {
        const generateOrderByClause = orderByArray => {
          return orderByArray
            .map(obj => {
              const key = Object.keys(obj)[0]
              const value = obj[key]
              return `${key} ${value.toUpperCase()}`
            })
            .join(', ')
        }

        const orderByClause = generateOrderByClause(orderBy)

        query += ` ORDER BY ${orderByClause}`
      }

      if (limit) {
        query += ` LIMIT  ${limit}`
      }
      if (offset) {
        query += ` OFFSET  ${offset}`
      }

      return (query += ';')
    }

    // ========================================実行部分========================================
    const {selects, where, limit, rawWhere, orderBy} = props
    const bigquery = BQ.getBigQueryClient()

    const query = props.sqlString ? props.sqlString : await builderQuery({selects, where, limit, rawWhere, orderBy})
    console.info({sql: query})

    const result = (await bigquery.query(query)) as anyObject[][]
    const rows = result[0]

    const count = rows.length

    console.debug(`${count} rows returned`)
    return rows
  }
}
