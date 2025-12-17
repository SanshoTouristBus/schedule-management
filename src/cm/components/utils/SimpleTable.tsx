'use client'
import {COLORS} from 'src/cm/lib/constants/constants'
import React, {CSSProperties} from 'react'

type Props = {
  headerArr?: any[]
  bodyArr: any[][]
  sumLabels?: any
  style?: CSSProperties
  showIndex?: boolean
  options?: {
    th?: {
      widthArr?: any[]
    }
    td?: {
      widthArr?: any[]
    }
  }
  trPropCreator?: (props: {trIndex: number; trArr?: any[]}) => any
}

const SimpleTable = React.memo((props: Props) => {
  const {
    bodyArr,
    sumLabels,
    showIndex = false,
    style = {
      maxWidth: '90vw',
      maxHeight: 500,
      background: 'white',
    },
    trPropCreator = (props: {trIndex: number; trArr?: any[]}) => {
      const rowBgColor = props.trIndex % 2 === 0 ? COLORS.table.thead : 'bg-white'

      return {
        style: {background: rowBgColor},
      }
    },
  } = props

  let headerArr = props?.headerArr
  if (!Array.isArray(headerArr?.[0])) {
    headerArr = [headerArr]
  }

  if (!bodyArr) {
    return <></>
  }
  const sumArr: any[] | undefined = sumLabels?.map((v, i) => {
    return v ? 0 : ''
  })

  return (
    <div className={`my-2`}>
      <div className={`table-wrapper border-[1px]  shadow-xs`} style={style}>
        <table className={` table-fixed`}>
          <thead>
            {headerArr?.map((row, idx) => {
              return (
                <tr key={idx}>
                  {showIndex && <th style={{width: 20}}></th>}
                  {row?.map((thContent, i) => {
                    const width = props?.options?.th?.widthArr?.[i]

                    return (
                      <th key={i} style={{width: width}}>
                        {thContent}
                      </th>
                    )
                  })}
                </tr>
              )
            })}
          </thead>
          {bodyArr.length === 0 ? (
            <tbody></tbody>
          ) : (
            <tbody>
              {bodyArr?.map((trArr, trIndex) => {
                return (
                  <tr key={trIndex} {...trPropCreator({trIndex, trArr})}>
                    {showIndex && <td>{trIndex + 1}</td>}
                    {trArr.map((tdContent, j) => {
                      // 数値以外を取り除きたいが、小数点は残したい
                      const toNumber = Number(tdContent?.toString().replace(/[^0-9.]/g, ''))

                      if (sumArr && !isNaN(sumArr[j])) {
                        sumArr[j] += toNumber
                      }

                      return (
                        <td key={j}>
                          <div className={`text-center text-sm sm:text-base`}>{tdContent}</div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          )}

          {sumArr && (
            <tfoot style={{background: '#e3e3e3'}}>
              <tr>
                {showIndex && <td>合計</td>}
                {sumArr.map((v, i) => {
                  const width = props?.options?.th?.widthArr?.[i]
                  return (
                    <td key={i} width={width}>
                      <span className={`mｒ-2`}>{v}</span>
                      <span>{sumLabels?.[i]}</span>
                    </td>
                  )
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
})

export default SimpleTable
