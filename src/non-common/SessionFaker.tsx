import { PrismaModelNames } from '@cm/types/prisma-types'
import { globalIds } from 'src/non-common/searchParamStr'

type targetModelType = {
  [key: string]: {
    modelNames: { name: PrismaModelNames; id_pw?: { id?: string; pw?: string }; globalId?: string }[]
  }
}
export class SessionFaker {
  static targetModels: targetModelType = {
    default: {
      modelNames: [
        //
        { name: 'user', id_pw: { id: 'email', pw: 'password' }, globalId: globalIds.globalUserId },
      ],
    },
  }

  static getTargetModels = () => {
    const ROOTPATH = process.env.NEXT_PUBLIC_ROOTPATH ?? ''
    const targetModels = this.targetModels?.[ROOTPATH] || this.targetModels?.['default']

    return targetModels?.modelNames
  }
}
