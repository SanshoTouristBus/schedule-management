'use client'

import React, {useCallback, useMemo} from 'react'

import useGlobal, {useGlobalPropType} from 'src/cm/hooks/globalHooks/useGlobal'
import {C_Stack, R_Stack} from 'src/cm/components/styles/common-components/common-components'

import {PrismaModelNames} from '@cm/types/prisma-types'

import GlobalModal from '@cm/components/utils/modal/GlobalModal'

import useInitEasySearcher from '@cm/components/DataLogic/TFs/MyTable/components/EasySearcher/useInitEasySearcher'

import EsGroupClient, {EsGroupClientPropType} from '@cm/components/DataLogic/TFs/MyTable/components/EasySearcher/EsGroupClient'
import {CircledIcon, IconBtn} from '@cm/components/styles/common-components/IconBtn'
import {SquareArrowRight} from 'lucide-react'
import {Wrapper} from '@cm/components/styles/common-components/paper'
import PlaceHolder from '@cm/components/utils/loader/PlaceHolder'
import {easySearchDataSwrType, EasySearchObject} from '@cm/class/builders/QueryBuilderVariables'
import {Filter} from 'lucide-react'
import {UseRecordsReturn} from '@cm/components/DataLogic/TFs/PropAdjustor/hooks/useRecords/useRecords'
import useWindowSize from '@cm/hooks/useWindowSize'
import {resetPaginationParams} from '@cm/components/DataLogic/TFs/MyTable/components/SearchHandler/SearchHandler'
import {Card} from '@cm/shadcn/ui/card'

export default function EasySearcher(props: {
  easySearchPrismaDataOnServer: easySearchDataSwrType
  useGlobalProps: useGlobalPropType
  dataModelName: PrismaModelNames
  UseRecordsReturn?: UseRecordsReturn
  hideEasySearch?: boolean
  // prismaDataExtractionQuery: prismaDataExtractionQueryType
}) {
  const {dataModelName, useGlobalProps, easySearchPrismaDataOnServer, hideEasySearch} = props
  const {dataCountObject, availableEasySearchObj = {}} = easySearchPrismaDataOnServer

  const {activeExGroup, nonActiveExGroup, RowGroups} = useInitEasySearcher({
    availableEasySearchObj,
    easySearchPrismaDataOnServer,
    dataCountObject,
    useGlobalProps,
  })

  const {query} = useGlobal()
  const {SP} = useWindowSize()

  const createNextQuery = useCallback(
    props => {
      let newQuery = {}
      if (availableEasySearchObj) {
        const {exclusiveGroup, keyValueList, refresh} = props.dataSource ?? {}

        const friends = Object.keys(availableEasySearchObj).filter(key => {
          const obj = availableEasySearchObj[key]

          return exclusiveGroup?.groupIndex === obj.exclusiveGroup?.groupIndex && obj.refresh !== true
        })

        const others = Object.keys(availableEasySearchObj).filter(key => {
          const obj = availableEasySearchObj[key]

          return exclusiveGroup?.groupIndex !== obj.exclusiveGroup?.groupIndex && obj.refresh !== true
        })

        const refreshes = Object.keys(availableEasySearchObj).filter(key => {
          const {refresh} = availableEasySearchObj[key]
          return refresh === true
        })

        if (refresh) {
          const resetQuery = Object.fromEntries(Object.keys(availableEasySearchObj).map(key => [key, undefined]))
          newQuery = {...resetQuery}
        } else {
          friends.forEach(key => (newQuery[key] = ''))
          others.forEach(key => (newQuery[key] = query[key]))
        }

        refreshes.forEach(key => (newQuery[key] = undefined))

        //関連のあるキーを挿入
        keyValueList.forEach(obj => {
          const {key, value} = obj

          const isSet = query[key] ?? '' === String(value)
          const newValue = isSet ? '' : String(value)

          newQuery[key] = newValue
        })
      }

      // ページングパラメータを削除（新しいプレフィックス方式に対応）
      resetPaginationParams(useGlobalProps.query, newQuery)

      return newQuery
    },
    [availableEasySearchObj, query]
  )

  const MainComponentMemo = useMemo(() => {
    return (
      <div>
        <R_Stack className={` items-center  flex-nowrap gap-2`}>
          {/* モーダル */}
          {nonActiveExGroup.length > 0 && (
            <div>
              <>
                <GlobalModal
                  id={`${dataModelName}-Es-Modal`}
                  Trigger={
                    <span className={`t-link  text-xs `}>
                      <CircledIcon>
                        <SquareArrowRight />
                      </CircledIcon>
                    </span>
                  }
                >
                  <C_Stack className={` gap-8   w-[90vw] `}>
                    {renderRowGroups({
                      RowGroups,
                      createNextQuery,
                      activeExGroup,
                      showAll: true,
                    })}
                  </C_Stack>
                </GlobalModal>
              </>
            </div>
          )}

          {/* RowGroups */}
          <C_Stack className={` w-full `}>
            {renderRowGroups({
              activeExGroup,
              RowGroups,
              createNextQuery,
              showAll: false,
            })}
          </C_Stack>
        </R_Stack>
      </div>
    )
  }, [dataModelName, nonActiveExGroup, RowGroups, activeExGroup, createNextQuery, hideEasySearch])

  if (activeExGroup.length === 0) return <PlaceHolder />

  const filterIsActive = activeExGroup.length > 0
  if (SP) {
    return (
      <GlobalModal
        id={`${dataModelName}-Es-Modal`}
        Trigger={
          <IconBtn className={`onHover`} color={filterIsActive ? `yellow` : `gray`}>
            <R_Stack>
              <Filter />
            </R_Stack>
          </IconBtn>
        }
      >
        {MainComponentMemo}
      </GlobalModal>
    )
  }

  return (
    <div>
      <R_Stack className={` items-stretch  gap-0.5`}>{MainComponentMemo}</R_Stack>
    </div>
  )
}

const renderRowGroups = ({
  activeExGroup,
  RowGroups,
  createNextQuery,
  showAll = true,
}: {
  activeExGroup: EsGroupClientPropType[]
  RowGroups: EsGroupClientPropType[][]
  createNextQuery: (props: {dataSource: EasySearchObject}) => void
  showAll?: boolean
}) => {
  if (showAll) {
    return (
      <div className={`grid grid-cols-3 gap-4`}>
        {RowGroups.map((EsGroupClientPropList, i) => {
          return EsGroupClientPropList.map((EsGroupClientProp, j) => {
            return (
              <Card key={j}>
                <EsGroupClient {...{showAll, EsGroupClientProp, createNextQuery}} />
              </Card>
            )
          })
        })}
      </div>
    )
  } else {
    return (
      <>
        {RowGroups.map((EsGroupClientPropList, i) => {
          return (
            <R_Stack key={i} className={`   w-fit  items-stretch justify-start gap-0 gap-y-1`}>
              {EsGroupClientPropList.filter(item => {
                const isOpenGroup = activeExGroup.some(g => {
                  return g.groupName === item.groupName
                })

                const isActiveGroup = item.searchBtnDataSources.some(d => {
                  return d.isActive
                })

                return isActiveGroup || isOpenGroup
              }).map((EsGroupClientProp, j) => {
                return (
                  <R_Stack key={j}>
                    {/* <R_Stack className={`${border}  relative pr-6 `}> */}
                    <Wrapper className={`p-0.5!`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 px-0.5">
                          <div className={` `}>
                            <EsGroupClient {...{EsGroupClientProp, createNextQuery}} />
                          </div>
                        </div>
                      </div>
                    </Wrapper>
                  </R_Stack>
                )
              })}
            </R_Stack>
          )
        })}
      </>
    )
  }
}
