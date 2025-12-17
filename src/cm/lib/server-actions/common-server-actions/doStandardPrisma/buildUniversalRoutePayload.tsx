import {prismaMethodType} from '@cm/types/prisma-types'
import {dataModelNameType} from '@cm/types/types'
import {anyObject} from '@cm/types/utility-types'

export const buildUniversalRoutePayload = (
  model: dataModelNameType,
  method: prismaMethodType,
  queryObject: anyObject,
  transactionPrisma
) => {
  let fetchKey
  if (queryObject.fetchKey) {
    fetchKey = queryObject.fetchKey
    delete queryObject.fetchKey
  }

  const body = (() => {
    queryObject = {...queryObject}
    //whereを追加する
    // if (whereId !== undefined) {
    //   queryObject.where = {...queryObject.where, id: whereId}
    // }

    const {where, include, create, update, ...data} = queryObject

    /**data / create / updateなどのpayloadを作成する */
    switch (method) {
      case 'create':
      case 'update': {
        queryObject = {
          where,
          include,
          data: {...data},
        }
        break
      }

      case 'upsert': {
        queryObject = {where, include, create: create ?? data, update: update ?? data}
        break
      }
    }

    return {
      model,
      method,
      queryObject,
      transactionPrisma,
    }
  })()

  return {body, fetchKey}
}
