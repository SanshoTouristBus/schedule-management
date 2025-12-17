import {fetchRawSql} from '@cm/class/Fields/lib/methods'
import {StrHandler} from '@cm/class/StrHandler'

type phraseAtom = {
  select: string[]
  from: string
  joins?: string[]
  where?: string[]
  groupBy?: string[]
  orderBy?: string[]
  limit?: number | undefined
}
export class SqlBuilder {
  static buildSql = (props: phraseAtom) => {
    const {select, from, joins, where, groupBy, orderBy, limit} = props
    let sql: any = []
    if (select) {
      sql.push(`SELECT ${select.join(`,\n`)}`)
    }

    if (from) sql.push(`FROM ${from}`)

    if (joins) {
      if (joins.some(str => str.includes(`ON`) === false)) {
        throw new Error(`joinStr must include 'on'`)
      }
      const joinSentence = joins.join(`\n`)
      sql.push(` ${joinSentence}`)
    }

    if (where) sql.push(`WHERE ${where.join(`\n`)}`)

    if (groupBy) sql.push(`GROUP BY ${groupBy.join(`,\n`)}`)

    if (orderBy) sql.push(`ORDER BY ${orderBy.join(`\n`)}`)

    if (limit) sql.push(`LIMIT ${limit}`)

    sql = sql.join(`\n`)

    return sql
  }
}

export function sql(strings, ...values) {
  const result = strings.reduce((prev, current, i) => prev + current + (values[i] || ''), '')

  return result
}

export type getPrismaRowsBySqlArgs = {
  parentModel?: string
  models?: string[]
  where: string
  page?: number
  take?: number
  skip?: number

  // query
}

export async function getPrismaRowsBySql(props: getPrismaRowsBySqlArgs) {
  const {parentModel, models = []} = props

  const LIMIT = ` LIMIT ${props.take} OFFSET ${props.skip}`

  const totalCountGroupBy = await fetchRawSql({sql: `SELECT COUNT(*) FROM "${parentModel}"  `})

  const mainSql = `SELECT * FROM "${parentModel}" ${LIMIT}`
  const {rows} = await fetchRawSql({sql: mainSql})

  const totalCount = Number(totalCountGroupBy[0]?.count)

  // サブモデルのデータをハッシュマップに変換
  const subModelRows = await Promise.all(
    models.map(async model => {
      const foreignKey = `${StrHandler.lowerCaseFirstLetter(model)}Id`
      const sqlString = sql`
        SELECT "${model}".*
        FROM "${parentModel}"
        LEFT JOIN "${model}" ON "${model}"."id" = "${parentModel}"."${foreignKey}"
      `
      const {rows} = await fetchRawSql({sql: sqlString})

      // ハッシュマップに変換
      const recordMap = rows.reduce(
        (acc, record) => {
          acc[record.id] = record

          return acc
        },
        {} as Record<string, any>
      )
      return {model, recordMap}
    })
  )

  const result = rows.map(row => {
    const obj = {}
    subModelRows.forEach((props: any) => {
      const {model, recordMap} = props
      const foreignKey = `${StrHandler.lowerCaseFirstLetter(model)}Id`
      obj[model] = recordMap[row[foreignKey]]
    })

    return {
      ...row,
      ...obj,
    }
  })

  return {rows: result, totalCount}
}
