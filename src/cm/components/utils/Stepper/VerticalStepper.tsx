import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {ChevronsDownIcon} from 'lucide-react'

const VerticalStepper = ({children}) => {
  return (
    <R_Stack className={`bg-primary-light text-sub-main mx-auto  w-full justify-around gap-2 rounded-sm py-2 font-bold `}>
      <ChevronsDownIcon className={`w-8`} />
      <span>{children}</span>
      <ChevronsDownIcon className={`w-8`} />
    </R_Stack>
  )
}
export default VerticalStepper
