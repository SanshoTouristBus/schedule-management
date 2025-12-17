import React from 'react'
import {FileText} from 'lucide-react'
import {R_Stack} from '@cm/components/styles/common-components/common-components'

const EmptyPlaceholder = (props: {className?: string; children?: React.ReactNode}) => {
  const {className = `text-gray-400 text-sm`, children} = props
  return (
    <R_Stack className={`-ml-1 gap-[0px]  ${className} w-fit`}>
      <FileText className="inline h-3" />
      <span className="-ml-1  ">{children ?? `未入力`}</span>
    </R_Stack>
  )
}

export default EmptyPlaceholder
