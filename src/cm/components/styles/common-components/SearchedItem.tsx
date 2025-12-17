import {X} from 'lucide-react'
import {IconBtn} from '@cm/components/styles/common-components/IconBtn'

export const SearchedItem = ({value, onClick, closeBtn = false}) => {
  return (
    <IconBtn color={`yellow`} onClick={onClick} rounded={false}>
      <div className={`flex`}>
        {value}
        {closeBtn && <X className={` w-4`} />}
      </div>
    </IconBtn>
  )
}
