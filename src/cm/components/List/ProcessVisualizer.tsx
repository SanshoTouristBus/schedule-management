import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {ChevronsRightIcon} from 'lucide-react'
import {Fragment} from 'react'
const ProcessVisualizer = ({
  processes,
  divider = <ChevronsRightIcon className={`  font-bold`} />,
  gapClass = `gap-1`,
  ...rest
}) => {
  return (
    <div {...rest}>
      <R_Stack className={` w-fit items-stretch ${gapClass}`}>
        {processes.map((p, i) => {
          const {isActive = true, component} = p

          return (
            <Fragment key={i}>
              <R_Stack className={`gap-1`}>
                <span className={`${isActive ? '' : ' opacity-40'}`}>{component}</span>
              </R_Stack>
              <div> {i !== processes.length - 1 && divider}</div>
            </Fragment>
          )
        })}
      </R_Stack>
    </div>
  )
}
export default ProcessVisualizer
