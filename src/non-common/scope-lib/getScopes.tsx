import { arr__findCommonValues } from '@cm/class/ArrHandler/array-utils/data-operations'
import { anyObject } from '@cm/types/utility-types'

import { judgeIsAdmin, roleIs, typeIs } from 'src/non-common/scope-lib/judgeIsAdmin'
import { globalIds } from 'src/non-common/searchParamStr'

type GroupieScopeType = {
  schoolId?: number
  teacherId?: number
  classroomId?: number
  isSchoolLeader: boolean
}


type getScopeOptionsProps = { query?: anyObject; roles?: any[] }

export const getScopes = (session: anyObject, options: getScopeOptionsProps) => {
  const { query, roles } = options ?? {}

  const roleNames = (roles ?? []).map(d => d.name)
  const login = session?.id ? true : false
  const { admin, getGlobalUserId } = judgeIsAdmin(session, query)

  const result = {
    login,
    admin,
    getGlobalUserId,
    getSanshoTouristScopes: () => {
      const userId = !admin ? session?.id : Number(query?.[globalIds.globalUserId] ?? session?.id ?? 0)


      const isSystemAdmin = !!arr__findCommonValues([`管理者`], roleNames)
      const isEditor = !!arr__findCommonValues([`編集者`], roleNames)
      const isViewer = !!arr__findCommonValues([`閲覧者`], roleNames)

      return { userId, isSystemAdmin, isEditor, isViewer }
    },
    getGroupieScopes: () => {
      const schoolId = !admin ? session?.schoolId : Number(query?.[globalIds.globalSchoolId] ?? 0)

      const teacherId = !admin ? session?.id : Number(query?.[globalIds.globalTeacherId] ?? 0)
      const isSchoolLeader = typeIs(['責任者'], session)

      let result: GroupieScopeType = {
        schoolId,
        teacherId,
        isSchoolLeader,
      }

      result = addAdminToRoles(result, session) as GroupieScopeType
      return result
    },


    getTbmScopes: () => {
      // const eigyoshoKirikae = !!arr__findCommonValues([`営業所切替`], roleNames)
      const isSystemAdmin = !!arr__findCommonValues([`管理者`], roleNames) || admin
      const isShocho = !!arr__findCommonValues([`所長`], roleNames)
      const isJimuin = !!arr__findCommonValues([`事務`], roleNames)

      const fakable = admin || isShocho

      const userId = !fakable ? session?.id : Number(query?.[globalIds.globalUserId] ?? session?.id ?? 0)
      const tbmBaseId = !fakable ? session?.tbmBaseId : Number(query?.[globalIds.globalTbmBaseId] ?? session?.tbmBaseId ?? 0)

      const tbmDriveInputUserId = !fakable ? session?.id : Number(query?.[globalIds.tbmDriveInputUserId] ?? Number(query?.[globalIds.globalUserId] ?? session?.id ?? 0))


      return { tbmDriveInputUserId, userId, tbmBaseId, isSystemAdmin, isShocho, isJimuin, }
    },


  }

  return result
}

const addAdminToRoles: (targetObject: any, session: anyObject) => anyObject = (targetObject, session) => {
  // const result: anyObject = {...targetObject}
  Object.keys(targetObject).forEach(key => {
    const value = targetObject[key]
    targetObject[key] = value

    if (typeof targetObject[key] !== 'object' && roleIs(['管理者'], session) && targetObject[key] === false) {
      targetObject[key] = true
    }
  })

  return targetObject
}
// 管理者・編集者・閲覧者
