import {prismaMethodType, PrismaModelNames} from '@cm/types/prisma-types'
import {requestResultType} from '@cm/types/types'


type chainType = {
  [key in PrismaModelNames]?: {
    when: prismaMethodType[]
    do: (props: {res: requestResultType; queryObject: any}) => Promise<requestResultType>
  }[]
}
export const prismaChain: chainType = {
  // genbaDay: [
  //   {
  //     when: [`upsert`, `update`, `create`],
  //     do: async ({res, queryObject}) => {
  //       // GetNinkuListを変える
  //       await chain_sohken_genbaDayUpdateChain({genbaId: res.result.genbaId})
  //       return res
  //     },
  //   },
  // ],
}
