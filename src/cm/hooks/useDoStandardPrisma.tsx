import {prismaMethodType, PrismaModelNames} from '@cm/types/prisma-types'
import useSWR from 'swr'
import {PrismaClient} from '@prisma/generated/prisma/client'
import {generalDoStandardPrisma} from '@cm/lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'

type useDoStandardPrismaType = <T extends PrismaModelNames, M extends prismaMethodType>(
  model: T,
  method: M,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  queryObject: Parameters<PrismaClient[T][M]>[0],
  options?: {deps: any[]}
) => {
  data: any
  isLoading: boolean
  isValidating: boolean
  error: any
  mutate: any
}
const useDoStandardPrisma: useDoStandardPrismaType = (model, method, queryObject, options) => {
  const key = JSON.stringify({model, method, queryObject, deps: options?.deps})

  const {data, isValidating, error, mutate} = useSWR(key, async () => {
    const res = await generalDoStandardPrisma(model, method, queryObject)

    return res.result
  })

  return {data: data, isLoading: !data && !error, isValidating, error, mutate}
}

export default useDoStandardPrisma
