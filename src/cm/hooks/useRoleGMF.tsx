import {Button} from '@cm/components/styles/common-components/Button'
import {CsvTable} from '@cm/components/styles/common-components/CsvTable/CsvTable'
import PlaceHolder from '@cm/components/utils/loader/PlaceHolder'
import {useGlobalModalForm} from '@cm/components/utils/modal/useGlobalModalForm'
import {atomKey} from '@cm/hooks/useJotai'
import {doStandardPrisma} from '@cm/lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'
import {RoleMaster, User} from '@prisma/generated/prisma/client'
import React from 'react'
import useSWR from 'swr'

export default function useRoleGMF() {
  type useRoleGMFType = {
    user: User & {UserRole: {RoleMaster: RoleMaster}[]}
  }
  return useGlobalModalForm<useRoleGMFType | null>('useRoleGMF' as atomKey, null, {
    mainJsx: ({GMF_OPEN}) => {
      const {data, mutate} = useSWR(String(GMF_OPEN?.user?.id), async () => {
        const {result: roleMaster} = await doStandardPrisma(`roleMaster`, `findMany`, {})
        const {result: user} = await doStandardPrisma(`user`, `findUnique`, {
          where: {id: GMF_OPEN?.user?.id ?? 0},
          include: {UserRole: {include: {RoleMaster: true}}},
        })
        return {roleMaster, user}
      })

      if (data) {
        const {roleMaster, user} = data
        return (
          <>
            {CsvTable({
              records: roleMaster.map(data => {
                const applied = user?.UserRole.find(d => d.RoleMaster.name === data.name)
                return {
                  csvTableRow: [
                    //
                    {label: '権限名', cellValue: data.name},
                    {
                      label: '付与',
                      cellValue: (
                        <div
                          {...{
                            onClick: async () => {
                              if (!applied) {
                                await doStandardPrisma(`userRole`, `create`, {
                                  data: {
                                    userId: user?.id ?? 0,
                                    roleMasterId: data.id,
                                  },
                                })
                              } else {
                                await doStandardPrisma(`userRole`, `delete`, {
                                  where: {id: applied?.id ?? 0, userId: user?.id ?? 0},
                                })
                              }

                              mutate()
                            },
                          }}
                        >
                          {applied ? <Button color="blue">あり</Button> : <Button color="gray">なし</Button>}
                        </div>
                      ),
                    },
                  ],
                }
              }),
            }).WithWrapper({})}
          </>
        )
      }
      return <PlaceHolder />
    },
  })
}
