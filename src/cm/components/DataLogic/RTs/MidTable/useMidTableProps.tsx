import {useState, useEffect, CSSProperties} from 'react'

import {NestHandler} from 'src/cm/class/NestHandler'

import {nestIsolatorType} from 'src/cm/class/NestHandler'
import {additionalPropsType} from '@cm/types/types'
import {anyObject} from '@cm/types/utility-types'
import {doTransaction} from '@cm/lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {PrismaModelNames} from '@cm/types/prisma-types'

import useLoader from 'src/cm/hooks/globalHooks/useLoader'
import {StrHandler} from '@cm/class/StrHandler'

import {arr__createUpdateDelete} from '@cm/class/ArrHandler/array-utils/data-operations'
import {obj__initializeProperty} from '@cm/class/ObjHandler/transformers'

export type MidTableProps = {
  ParentData: anyObject
  models: {
    parent?: PrismaModelNames
    mid?: PrismaModelNames
    another?: PrismaModelNames
    children?: PrismaModelNames
  }
  candidates: anyObject[]
  relation?: // | 'oneToMany'
  'manyToMany' | 'manyToManyRecursive'

  uniqueRelationalKey?: string
  table?: {
    style?: CSSProperties
    td?: {
      href?: string
    }
  }
  propsOverride?: any
  groupBy?: nestIsolatorType
  keysToShow?: nestIsolatorType
  additional?: additionalPropsType
}
const useMidTableProps = (props: MidTableProps) => {
  const {
    ParentData,
    models,
    candidates,
    relation = 'manyToMany',
    uniqueRelationalKey,
    table,
    propsOverride,
    groupBy,
    keysToShow,
  } = props

  const {GROUPED_LIST_OBJECT} = CreateGroups({candidates, groupBy})

  const {toggleLoad} = useLoader()

  /**必要なprops */
  const {
    parentId,
    parentModelIdStr,
    anotherModelIdStr,
    initiallinkedData,
    setinitiallinkedData,
    linkedData,
    setlinkedData,
    otherData,
    setotherData,
    handleToggle,
  } = (() => {
    const parentId = ParentData?.id ?? 0
    const midTable = ParentData?.[StrHandler.capitalizeFirstLetter(models?.mid)]

    const [initiallinkedData, setinitiallinkedData] = useState<anyObject[]>([])
    const [linkedData, setlinkedData] = useState<anyObject[]>([])
    const [otherData, setotherData] = useState<anyObject[]>([])
    const {parentModelIdStr, anotherModelIdStr} = createIdstrs({models})

    /**データを初期化する */
    /**セットし直す */
    useEffect(() => {
      const linked: anyObject[] = []
      const others: anyObject[] = []
      candidates?.map((thisItem: anyObject) => {
        const isLinked = isLinkedToParent({
          models,
          thisItem,
          relation,
          ParentData,
          anotherModelIdStr,
          midTable,
        })

        if (isLinked) {
          linked.push(thisItem)
        } else {
          others.push(thisItem)
        }
      })

      setinitiallinkedData(linked)
      setlinkedData(linked)
      setotherData(others)
    }, [ParentData, candidates, midTable])

    /**データ切り替え */
    const handleToggle = (item: anyObject, isLinked: boolean) => {
      if (isLinked) {
        setlinkedData(prev => prev.filter(data => data.id !== item.id))
        setotherData([...otherData, item])
      } else {
        setotherData(prev => prev.filter(data => data.id !== item.id))
        setlinkedData([...linkedData, item])
      }
    }

    return {
      parentId,
      parentModelIdStr,
      anotherModelIdStr,
      initiallinkedData,
      setinitiallinkedData,
      linkedData,
      setlinkedData,
      otherData,
      setotherData,
      handleToggle,
    }
  })()

  /**データを確定し、トランザクションをかける */
  const handleConfirm = async () => {
    await toggleLoad(async () => {
      /**更新するデータを差分形成 */
      const {createArr, updateArr, deleteArr} = arr__createUpdateDelete(initiallinkedData, linkedData)

      if (propsOverride?.handleConfirm) {
        /**handleConfirmの指定がある場合 */
        propsOverride?.handleConfirm({
          createArr,
          updateArr,
          deleteArr,
          initiallinkedData,
          linkedData,
        })
        return
      } else {
        /**handleConfirmの指定がない場合 ➡︎ トランザクションを実施*/

        let transactionQueryList: any[] = []
        switch (relation) {
          case 'manyToMany':
            transactionQueryList = [
              ...createArr.map(item => {
                return {
                  model: models.mid,
                  method: 'create',
                  queryObject: {
                    data: {
                      [parentModelIdStr]: parentId,
                      [anotherModelIdStr]: item.id,
                    },
                  },
                }
              }),
              ...deleteArr.map(item => {
                return {
                  model: models.mid,
                  method: 'delete',
                  queryObject: {
                    where: {
                      [uniqueRelationalKey ?? '']: {
                        [parentModelIdStr]: parentId,
                        [anotherModelIdStr]: item.id,
                      },
                    },
                  },
                }
              }),
            ]

            break
        }

        const res = await doTransaction({transactionQueryList})
        return res
      }
    })
  }
  return {
    originalProps: {
      ParentData,
      models,
      candidates,
      relation,
      uniqueRelationalKey,
      table,
      propsOverride,
      groupBy,
      keysToShow,
    },

    extraProps: {
      GROUPED_LIST_OBJECT,
      parentId,
      parentModelIdStr,
      anotherModelIdStr,
      initiallinkedData,
      setinitiallinkedData,
      linkedData,
      setlinkedData,
      otherData,
      setotherData,
      handler: {
        handleToggle,
        handleConfirm,
      },
    },
  }
}

export default useMidTableProps

/**~idを抽出 */
export function createIdstrs(props) {
  const {models} = props ?? {}
  //studentId
  const parentModelIdStr = models.parent ? StrHandler.lowerCaseFirstLetter(models.parent) + 'Id' : ''

  const anotherModelIdStr = models.another ? StrHandler.lowerCaseFirstLetter(models.another) + 'Id' : ''
  const childrenModelIdStr = models.children ? StrHandler.lowerCaseFirstLetter(models.children) + 'Id' : ''

  return {
    parentModelIdStr,
    anotherModelIdStr,
    childrenModelIdStr,
  }
}

export const isLinkedToParent = ({models, thisItem, relation, ParentData, anotherModelIdStr, midTable}) => {
  switch (relation) {
    case 'manyToManyRecursive': {
      const recursiveSelfIds = ParentData?.[models?.mid]
        ?.map(modelData => {
          const studentIds = modelData?.[models.parent].map(data => data.id) //studentId
          return studentIds
        })
        .flat()

      return recursiveSelfIds?.includes(thisItem?.['id']) //studentId
    }

    case 'manyToMany': {
      return midTable?.find(table => {
        return table?.[anotherModelIdStr] === thisItem.id
      })
    }
  }
}

/** candidates(選択肢になる全ての値)のうち、groupByの指定がある場合は、groupByの指定に従ってグループ化する*/
export const CreateGroups = ({candidates, groupBy}) => {
  const GROUPED_LIST_OBJECT = {}
  candidates?.forEach(item => {
    const key = NestHandler.makeKeyByGroupByObj({dataObj: item, nestIsolatorArry: groupBy}) ?? ''

    obj__initializeProperty(GROUPED_LIST_OBJECT, key, [])

    GROUPED_LIST_OBJECT[key].push(item)
  })

  return {GROUPED_LIST_OBJECT}
}
