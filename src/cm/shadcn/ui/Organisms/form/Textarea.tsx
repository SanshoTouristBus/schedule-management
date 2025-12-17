import Input from '@shadcn/ui/Organisms/form/Input'
import React from 'react'

type textareaProps = formPropType & {
  rows?: number
  cols?: number
}
export default function Textarea(props: textareaProps) {
  return <Input {...props} type={`textarea`} className={[`w-full border `, props.className].join(` `)} />
}
