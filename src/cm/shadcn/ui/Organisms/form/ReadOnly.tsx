import Label from '@shadcn/ui/Organisms/form/Label'
import React from 'react'

const ReadOnly = ({label, value, className = ''}) => {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <input disabled type="text" value={value ?? ''} readOnly className="w-full  border p-2 rounded bg-gray-200" />
    </div>
  )
}

export default ReadOnly
