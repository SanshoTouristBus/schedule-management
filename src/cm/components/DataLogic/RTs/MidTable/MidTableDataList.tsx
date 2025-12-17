import React, {CSSProperties, useState} from 'react'
import {NestHandler} from 'src/cm/class/NestHandler'

import {MinusIcon, PlusIcon} from 'lucide-react'
import SimpleTable from 'src/cm/components/utils/SimpleTable'
import MidTableRowGroup from 'src/cm/components/DataLogic/RTs/MidTable/MidTableRowGroup'

export type TableProps = {
  setlinkedData: any
  setotherData: any
  GROUPED_LIST_OBJECT: any
  linkedData: any
  table: any
  handleToggle: any
  keysToShow: any
  groupBy?: any
  type?: 'linked' | 'other' | 'single'
}
export default function MidTableDataList(props: TableProps) {
  const {type, setlinkedData, linkedData = [], table, handleToggle, keysToShow, GROUPED_LIST_OBJECT} = props
  const label = (
    <div className={`bg-sub-light sticky top-0    p-1 text-center`}>{type === 'linked' ? '適応済み' : '選択してください'}</div>
  )

  const groupBy = props.groupBy
  if (type === 'single') {
    return <Single {...{handleToggle, groupBy, linkedData, keysToShow, GROUPED_LIST_OBJECT}} />
  }

  const tableStyle: CSSProperties = {
    maxHeight: 300,
    minHeight: 60,
    width: 400,

    ...table?.style,
  }
  return (
    <>
      <div>{label}</div>
      <div className={`table-wrapper `} style={tableStyle}>
        <table className={`[&_td]:px-2! [&_th]:p-1!`}>
          {Object.keys(GROUPED_LIST_OBJECT).map(gropupKey => {
            const IconComponent = type === 'linked' ? MinusIcon : PlusIcon

            const listForGroup = GROUPED_LIST_OBJECT[gropupKey].filter(data => {
              const isLinked = linkedData.find((l: any) => l.id === data.id)
              return isLinked || type === 'other'
            })

            return (
              <MidTableRowGroup
                key={gropupKey}
                {...{listForGroup, linkedData, setlinkedData, table, keysToShow, type, handleToggle, gropupKey, IconComponent}}
              />
            )
          })}
        </table>
      </div>
    </>
  )
}

const Single = ({handleToggle, groupBy, linkedData, keysToShow, GROUPED_LIST_OBJECT}) => {
  const [seachInputState, setseachInputState] = useState({name: '', group: ''})

  const Toggler = ({data}) => {
    const {isLinked} = data

    const handleOnClick = data => {
      handleToggle(data, isLinked)
    }

    return (
      <input
        type="checkbox"
        checked={isLinked ? true : false}
        className={`h-[16px] w-[16px] cursor-pointer align-middle`}
        onChange={e => {
          handleOnClick(data)
        }}
      />
    )
  }
  const headerArr = groupBy ? ['所属', '名称', '選択'] : ['名称', '選択']
  const bodyArr: any[] = []
  Object.keys(GROUPED_LIST_OBJECT).map(key => {
    const listForGroup = GROUPED_LIST_OBJECT[key].map(data => {
      const isLinked = linkedData.find((l: any) => l.id === data.id)
      return {isLinked, ...data}
    })

    listForGroup.forEach(data => {
      const value =
        NestHandler.makeKeyByGroupByObj({
          dataObj: data,
          nestIsolatorArry: keysToShow,
        }) ?? data['name']

      const row = groupBy ? [key, value, <Toggler {...{data}} />] : [value, <Toggler {...{data}} />]
      if (seachInputState.name && !value.includes(seachInputState.name)) return
      bodyArr.push(row)
    })
  })

  const Searcher = () => {
    return (
      <div className={`row-stack mb-4 gap-0`}>
        <label className={`inline-block w-1/2 px-2`}>
          名称
          <input
            className={`myFormControl ml-2 w-[150px]`}
            value={seachInputState.name}
            onChange={e =>
              setseachInputState(prev => {
                return {...prev, name: e.target.value}
              })
            }
          />
        </label>
        <label className={`inline-block w-1/2 px-2`}>
          所属
          <input
            className={`myFormControl ml-2 w-[150px]`}
            value={seachInputState.group}
            onChange={e =>
              setseachInputState(prev => {
                return {...prev, group: e.target.value}
              })
            }
          />
        </label>
      </div>
    )
  }

  return (
    <div>
      <Searcher />
      <SimpleTable {...{headerArr, bodyArr, style: {width: 'fit-content'}}} />
    </div>
  )
}
