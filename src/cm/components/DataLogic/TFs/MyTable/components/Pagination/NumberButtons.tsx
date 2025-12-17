import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {ChevronsLeftIcon, ChevronsRightIcon} from 'lucide-react'
import {cl} from 'src/cm/lib/methods/common'
import {Fragment} from 'react'

export const NumberButtons = ({arrayWithDots, changePage, page}) => {
  const blueText = `text-sub-main !t-link`
  const cevronClass = `h-5 w-5 ${blueText} onHover !t-link`
  return (
    <R_Stack className={`items-center  justify-center  gap-1   `}>
      <ChevronsLeftIcon className={cevronClass} onClick={() => changePage(page - 1)} />
      {arrayWithDots.map((number, index) => {
        const active = number === page ? 'bg-blue-500 text-white px-1.5 rounded-sm' : `${blueText} px-0.5`
        return (
          <Fragment key={index}>
            {number === '...' ? (
              <>
                <div className={`px-1`}>{number}</div>
              </>
            ) : (
              <>
                <button onClick={() => changePage(number)} className={cl(active, `onHover`)} key={number}>
                  {number}
                </button>
              </>
            )}
          </Fragment>
        )
      })}
      <ChevronsRightIcon className={cevronClass} onClick={() => changePage(page + 1)} />
    </R_Stack>
  )
}
