import React, {Fragment, useEffect, useState} from 'react'
import {NestHandler} from 'src/cm/class/NestHandler'
import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {Search} from 'lucide-react'
import {cl} from 'src/cm/lib/methods/common'

import {T_LINK} from '@cm/components/styles/common-components/links'
import {arr__createUpdateDelete} from '@cm/class/ArrHandler/array-utils/data-operations'

const MidTableRowGroup = ({
  listForGroup,
  linkedData,
  setlinkedData,
  table,
  keysToShow,
  type,
  handleToggle,
  gropupKey,
  IconComponent,
}) => {
  const [recordsOnGroup, setrecordsOnGroup] = useState<any[]>(listForGroup)
  const [searchInput, setsearchInput] = useState('')
  useEffect(() => {
    setrecordsOnGroup(listForGroup)
  }, [listForGroup, linkedData])

  const handleToggleAll = () => {
    setlinkedData(prev => {
      if (type === 'linked') {
        return [...arr__createUpdateDelete(prev, listForGroup).deleteArr]
      } else {
        return [...prev, ...arr__createUpdateDelete(prev, listForGroup).createArr]
      }
    })
  }
  const bgColor = type === 'linked' ? 'bg-primary-main!' : 'bg-sub-main! '

  const iconClass = cl(
    ` h-5 w-5  cursor-pointer rounded-sm  p-0.5  text-white `,
    type !== 'linked' ? 'bg-primary-main!' : 'bg-sub-main!'
  )

  if (listForGroup?.length === 0) return null

  const filteredList = recordsOnGroup.filter(data => {
    return Object.values(data).some(value => String(value).includes(searchInput)) //=>
  })

  return (
    <Fragment>
      <thead>
        {listForGroup?.length > 0 && (
          <tr className={`text-start align-top  text-white`}>
            <th className={cl(bgColor)} colSpan={4}>
              <R_Stack className={` flex-nowrap items-start`}>
                <IconComponent className={cl(iconClass, `h-5 w-5`)} strokeWidth={4} onClick={handleToggleAll} />
                <R_Stack className={` w-full justify-between`}>
                  <R_Stack className={`w-fit  flex-nowrap text-[14px] `}>
                    <div>{gropupKey ? gropupKey : ''}</div>
                  </R_Stack>

                  <R_Stack>
                    <Search className={`w-5`} />
                    <input
                      value={searchInput}
                      onChange={e => setsearchInput(e.target.value)}
                      type="text"
                      className={` text-sub-main w-[120px] bg-white px-2`}
                    />
                  </R_Stack>
                </R_Stack>
              </R_Stack>
            </th>
            {/* <th className={cl(bgColor, `w-full`)} colSpan={3}></th> */}
          </tr>
        )}
      </thead>
      <tbody>
        {filteredList.map(data => {
          const isLinked = linkedData.find(l => l.id === data.id)
          let href = ''
          let linkClass = ''
          if (table?.td?.href) {
            href = `${table?.td?.href}/${data.id}`
            linkClass = 't-link'
          }

          const value =
            NestHandler.makeKeyByGroupByObj({
              dataObj: data,
              nestIsolatorArry: keysToShow,
            }) ?? data['name']

          const disabled = isLinked && type === 'other'
          return (
            <tr key={data.id} className={`${disabled ? ' bg-gray-300 opacity-30' : ''}`}>
              <td></td>
              <td className={`w-[20px]`}>
                <IconComponent
                  className={iconClass}
                  strokeWidth={2}
                  onClick={e => {
                    if (!disabled) {
                      handleToggle(data, isLinked)
                    }
                  }}
                />
              </td>

              <td>
                {href ? (
                  <T_LINK className={linkClass} href={href}>
                    {value}
                  </T_LINK>
                ) : (
                  <span>{value}</span>
                )}
              </td>
            </tr>
          )
        })}
        {/* <tr className={`h-[20px]`}>
          <th></th>
        </tr> */}
      </tbody>
    </Fragment>
  )
}

export default MidTableRowGroup
