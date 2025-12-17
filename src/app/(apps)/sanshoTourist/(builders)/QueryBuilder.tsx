import { getIncludeType, includeProps, roopMakeRelationalInclude } from '@cm/class/builders/QueryBuilderVariables'
import { Prisma } from '@prisma/generated/prisma/client'

export class QueryBuilder {
  static getInclude = (includeProps: includeProps) => {
    const include: getIncludeType = {
      // 車両マスタ
      stVehicle: {} as Prisma.StVehicleFindManyArgs,

      // 会社マスタ (担当者含む)
      stCustomer: {
        include: {
          StContact: {
            where: { active: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      } as Prisma.StCustomerFindManyArgs,

      // 担当者マスタ (会社含む)
      stContact: {
        include: {
          StCustomer: {},
        },
      } as Prisma.StContactFindManyArgs,

      // 祝日マスタ
      stHoliday: {} as Prisma.StHolidayFindManyArgs,



      // スケジュール
      stSchedule: {
        include: {
          StVehicle: {},
          StCustomer: {},
          StContact: {},
          StScheduleDriver: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      } as Prisma.StScheduleFindManyArgs,

      // 点呼者
      stRollCaller: {} as Prisma.StRollCallerFindManyArgs,

      // 公開範囲設定
      stPublishSetting: {} as Prisma.StPublishSettingFindManyArgs,

      // ユーザー
      user: {} as Prisma.UserFindManyArgs,
    }

    Object.keys(include).forEach(key => {
      roopMakeRelationalInclude({
        parentName: key,
        parentObj: include[key],
      })
    })

    return include
  }
}
