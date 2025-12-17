import {bodyRecordsType, stylesInColumns} from '@cm/components/styles/common-components/CsvTable/CsvTable'
import {Counter} from '@cm/components/styles/common-components/Table'
import {cl} from '@cm/lib/methods/common'

export type CsvTableBodyProps = {
  bodyRecords: bodyRecordsType
  stylesInColumns?: stylesInColumns
}

export function CsvTableBody(props: CsvTableBodyProps) {
  return (
    <tbody>
      {props.bodyRecords?.map((row, rowIdx) => {
        const {csvTableRow, ...restPropsOnTr} = row

        return (
          <tr
            key={rowIdx}
            {...restPropsOnTr}
            className={[
              //
              restPropsOnTr?.className,
              `divide-x divide-y `,
            ].join(` `)}
          >
            {csvTableRow?.map((cell, celIdx) => {
              const stylesInThisColumn = props?.stylesInColumns?.[celIdx]
              const {cellValue, className, cellValueRaw, thStyle, ...restPropsOnTd} = cell ?? {}
              if (cell.colSpan === 0) return null
              const isNumber = typeof cellValue === 'number'
              let style = {...stylesInThisColumn?.style}
              if (isNumber) {
                style.textAlign = 'right'
              }
              style = {...style, ...cell.style}

              return (
                <td
                  key={celIdx}
                  {...restPropsOnTd}
                  {...{
                    style,
                    className: cl(className, stylesInThisColumn?.className),
                  }}
                >
                  {isNumber ? <Counter>{cellValue}</Counter> : cellValue}
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  )
}
