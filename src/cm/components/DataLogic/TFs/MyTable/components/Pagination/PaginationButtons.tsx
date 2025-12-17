import {ChevronsLeft, ChevronsRight} from 'lucide-react'
import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {twMerge} from 'tailwind-merge'

const PaginationButtons = ({array, changePage, page, partClasses, totalCount, pageCount}) => {
  const cevronClass = `h-6 w-6 t-link onHover !t-link`
  return (
    <R_Stack className={`gap-0`}>
      <div className={twMerge(partClasses.inputGroupClass)}>
        <R_Stack className={`gap-1`}>
          <ChevronsLeft className={cevronClass} onClick={() => changePage(page - 1)} />

          <select
            id={`take`}
            className={`${partClasses.selectClass} p-0`}
            value={page}
            onChange={e => {
              changePage(Number(e.target.value))
            }}
          >
            {array.map((number, index) => {
              return <option key={index}>{number}</option>
            })}
          </select>
          <ChevronsRight className={cevronClass} onClick={() => changePage(page + 1)} />
        </R_Stack>
      </div>
      <small>/</small>
      <small className={`ml-0.5`}>{pageCount}</small>
    </R_Stack>
  )
}

export default PaginationButtons
