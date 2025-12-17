import { StrHandler } from '@cm/class/StrHandler'
import { fetchAlt } from '@cm/lib/http/fetch-client'

import { basePath } from '@cm/lib/methods/common'
import { getSchema } from '@cm/lib/methods/prisma-schema'
import { getScopes } from 'src/non-common/scope-lib/getScopes'
import { SessionFaker } from 'src/non-common/SessionFaker'

export const FakeOrKeepSession = async ({ query, realSession }) => {
  const tempScopes = getScopes(realSession, { query })
  const globalUserId = tempScopes.getGlobalUserId()

  // const globalKeys = Object.keys(query ?? {}).filter(key => key.includes('g_'))

  // const models = globalKeys.map(key => key.replace(/g_|Id/g, ''))
  const models = SessionFaker.getTargetModels()
  const schema = getSchema()

  let fakeUser: any = null

  for (let i = 0; i < models.length; i++) {
    const { name: modelName, id_pw } = models[i]

    const isValidModel = schema[StrHandler.capitalizeFirstLetter(modelName)]

    if (!isValidModel) continue


    const payload = {
      model: modelName,
      method: `findUnique`,
      queryObject: {
        where: { id: Number(globalUserId ?? 0) },
      },
      fetchKey: 'middleware fetching',
    }

    if (fakeUser === null && !!globalUserId) {
      const res = await fetchAlt(`${basePath}/api/prisma/universal`, payload)
      const { result: data } = res ?? {}

      fakeUser = data
      // return data
      continue
    }
  }



  const result = { ...(fakeUser ?? realSession), role: realSession?.role }


  return result
}
