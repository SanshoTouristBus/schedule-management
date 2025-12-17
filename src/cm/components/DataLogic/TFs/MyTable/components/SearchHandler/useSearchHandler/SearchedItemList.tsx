import {Sub} from '@cm/components/DataLogic/TFs/MyTable/components/SearchHandler/search-methods'
import {R_Stack} from 'src/cm/components/styles/common-components/common-components'

import {SearchedItem} from 'src/cm/components/styles/common-components/SearchedItem'
import React, {useEffect, useState} from 'react'
import {formatDate} from '@cm/class/Days/date-utils/formatters'

import {judgeColType} from '@cm/class/Fields/lib/methods'

import {PrismaModelNames} from '@cm/types/prisma-types'
import {generalDoStandardPrisma} from '@cm/lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'
import {IconBtn} from '@cm/components/styles/common-components/IconBtn'

export default function SearchedItemList(props: {
  Cached_Option_Props
  columns
  SearchQuery
  searchQueryKey
  dataModelName
  ResetBtnMemo
  query
}) {
  const {Cached_Option_Props, columns, SearchQuery, searchQueryKey, dataModelName, ResetBtnMemo, query} = props
  const AND = SearchQuery.createWhere({dataModelName, query})
  if (Object.keys(AND).length === 0) return null

  const [SearchedItems, setSearchedItems] = useState<any[]>([])

  useEffect(() => {
    const init = async () => {
      const SearchedItems = await Promise.all(
        Object.keys(AND).map(async (key, i) => {
          const value = AND[key]

          const labels = await Promise.all(
            Object.keys(value).map(async (colKey, i) => {
              const colObj = columns.flat().find(col => col.id === colKey)
              const colLabel = colObj?.label
              const searchFormats = Sub.getSearchFormats({col: colObj}).map(format => {
                const {label: searchTypeLabel, searchType} = format
                return {
                  searchType,
                  colLabel,
                  searchTypeLabel,
                }
              })

              const values = await Promise.all(
                Object.values(value).map(async (searchMethodsObj: any) => {
                  return await Promise.all(
                    Object.entries(searchMethodsObj).map(async (arr: any) => {
                      const [searchType, searchedValue] = arr
                      let searchedValueforDisplay = arr[1]

                      if (colObj?.type === `date`) {
                        searchedValueforDisplay = formatDate(searchedValue)
                      } else if (judgeColType(colObj) === `selectId`) {
                        const model = String(colObj?.id)?.split(`Id`)[0] as PrismaModelNames

                        const {result: theOption} = await generalDoStandardPrisma(model, `findUnique`, {
                          where: {id: searchedValue},
                        })
                        searchedValueforDisplay = (
                          <IconBtn color={theOption?.color ?? ``} rounded={true}>
                            {theOption?.name}
                          </IconBtn>
                        )
                      } else {
                        searchedValueforDisplay = searchedValue
                      }

                      const theFormat = searchFormats.find(format => format.searchType === searchType)
                      return {
                        colLabel,
                        searchTypeLabel: theFormat?.searchTypeLabel,
                        searchedValue: searchedValueforDisplay,
                      }
                    })
                  )
                })
              )

              return values.flat()
            })
          )

          return labels.flat()
        })
      )

      const result = SearchedItems.flat()
      setSearchedItems(result)
    }
    init()
  }, [])

  return (
    <div>
      {query[searchQueryKey] && (
        <R_Stack>
          {SearchedItems.map((d, i) => {
            const {colLabel, searchTypeLabel, searchedValue} = d

            return (
              <div key={i}>
                <SearchedItem
                  {...{
                    onClick: () => {
                      return
                    },
                    value: (
                      <R_Stack className={`gap-0.5 items-center `}>
                        <div className={`font-bold text-xs text-gray-700`}>{colLabel}</div>
                        <div className={` text-gray-500 `}>が</div>
                        <div className={`font-bold  text-red-700  `}>{searchedValue}</div>
                        <div className={`font-bold text-xs text-gray-700`}>{searchTypeLabel}</div>
                      </R_Stack>
                    ),
                  }}
                />
              </div>
            )
          })}
        </R_Stack>
      )}
    </div>
  )
}
