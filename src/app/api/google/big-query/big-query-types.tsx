export type bigQuerytableConfig = {
  datasetId: string
  tableId: string
}

export type typeStr = `STRING`
export type operatorStr = `=` | `>=` | `<=` | `>` | `<` | `!=`

export type bigQueryWhere = {
  key: string
  value: any
  operator?: operatorStr
  type?: typeStr
}

export type bigQuerySqlArgs = {
  sqlString?
  selects?: string[] | undefined
  where?: bigQueryWhere[] | undefined
  limit?: number | undefined
  rawWhere?: string | undefined
  offset?: number | undefined
  orderBy?:
    | {
        [key: string]: `asc` | `desc`
      }[]
    | undefined
}

export type bgDataSet = {
  _events
  _eventsCount
  _maxListeners
  metadata
  baseUrl
  parent
  id
  createMethod
  methods
  interceptors
  pollIntervalMs
  projectId
  location
  bigQuery
  getModelsStream
  getRoutinesStream
  getTablesStream
  getTables
  tables: bqTable[]
}

export type bqTable = {
  kind
  id
  tableReference: {
    projectId
    datasetId
    tableId
  }
  type
  creationTime
}
