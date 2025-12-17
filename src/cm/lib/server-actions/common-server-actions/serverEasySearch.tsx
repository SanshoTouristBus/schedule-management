'use server'

import prisma from 'src/lib/prisma'

export const getEasySearchBtnCountData = async ({queryArrays}) => {
  const method = 'aggregate'

  const result = await Promise.all(
    queryArrays.map(async obj => {
      const {key, dataModelName, select, where} = obj

      const records = await prisma[dataModelName][method]({
        select: {_count: true},
        where: where,
      })

      const totalCount = records._count.id
      return [key, totalCount]
    })
  )
  return result
}
