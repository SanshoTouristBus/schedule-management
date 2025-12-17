'use server'
import {ObjectMap} from './common'
import {anyObject} from '@cm/types/utility-types'
import {HREF} from 'src/cm/lib/methods/urls'
import {Days} from '@cm/class/Days/Days'
import {formatDate} from '@cm/class/Days/date-utils/formatters'
import {toUtc} from '@cm/class/Days/date-utils/calculations'

export const redirectToDefaultQuery = async (props: {query: anyObject; defaultQueryAsStr: anyObject; pathname?: string}) => {
  const {query, pathname = ''} = props

  let defaultQueryAsStr = props.defaultQueryAsStr
  defaultQueryAsStr = ObjectMap(props.defaultQueryAsStr, (key, value) => {
    return String(value)
  })

  // const queryIsReady = query.redirected ? true : false
  // const redirectPath = HREF(pathname, {...query, ...defaultQueryAsStr, redirected: true}, query)

  const queryIsReady = !!Object.keys(defaultQueryAsStr).every(key => {
    return query[key] || defaultQueryAsStr[key] === undefined
  })

  const redirectPath = HREF(pathname, {...query, ...defaultQueryAsStr}, query)

  if (queryIsReady === false) {
    return redirectPath
  } else {
    return undefined
  }
}

export type whereQueryType =
  | {
      gte?: Date | undefined
      lte?: Date | undefined
    }
  | undefined

export type getWhereQueryType = {
  query: anyObject
  defaultQuery?: anyObject
  whereQueryConverter?: (whereQuery: whereQueryType) => whereQueryType
  fromKey?: string
  toKey?: string
}
export const getWhereQuery = async (props: getWhereQueryType) => {
  const {query, defaultQuery = {}, whereQueryConverter, fromKey = `from`, toKey = `to`} = props

  const defaultQueryAsStr = ObjectMap(defaultQuery, (key, value) => {
    if (!value) return value

    if (Days.validate.isDate(value)) {
      const result = formatDate(value)

      return result
    }
    return value
  })

  const redirectPath = await redirectToDefaultQuery({query, defaultQueryAsStr: defaultQueryAsStr})

  let whereQuery: whereQueryType = {
    gte: query[fromKey] ? toUtc(query[fromKey]) : undefined,
    lte: query[toKey] ? toUtc(query[toKey]) : undefined,
  }

  if (whereQueryConverter) {
    whereQuery = await whereQueryConverter(whereQuery)
  }

  return {whereQuery, redirectPath}
}

export const dateSwitcherTemplate = async (props: {query; firstDayOfMonth?: Date; defaultWhere?: any}) => {
  const {query, firstDayOfMonth = Days.month.getMonthDatum(new Date()).firstDayOfMonth} = props

  const defaultWhere = props.defaultWhere ?? {month: formatDate(firstDayOfMonth)}

  const {redirectPath} = await getWhereQuery({query, defaultQuery: defaultWhere})
  let whereQuery: {
    gte?: Date | undefined
    // lt?: Date | undefined
    lte?: Date | undefined
  } = {}

  const FROM = query.from ? toUtc(query.from) : defaultWhere?.from
  const TO = query.to ? toUtc(query.to) : defaultWhere?.to

  if (FROM && TO) {
    whereQuery = {gte: FROM, lte: TO}
  } else if (FROM && TO === undefined) {
    whereQuery = {gte: FROM, lte: Days.day.add(FROM, 1)}
  } else if (query.month) {
    const MONTH = toUtc(query.month)

    const {firstDayOfMonth, lastDayOfMonth} = Days.month.getMonthDatum(MONTH)
    whereQuery = {gte: firstDayOfMonth, lte: lastDayOfMonth}
  }

  return {whereQuery, redirectPath}
}

// export const redirectToThisMonthQuery = async ({query}) => {
//   const today = getMidnight()

//   const {firstDayOfMonth, lastDayOfMonth, days} = Days.month.getMonthDatum(today)

//   const {whereQuery, redirectPath} = await dateSwitcherTemplate({query, firstDayOfMonth, defaultWhere: {month: firstDayOfMonth}})

//   return {redirectPath, whereQuery, firstDayOfMonth, lastDayOfMonth, today, days}
// }
