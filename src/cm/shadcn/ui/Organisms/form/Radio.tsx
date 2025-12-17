import Label from '@shadcn/ui/Organisms/form/Label'
import useFormProps from '@shadcn/ui/Organisms/form/useFormProps'
import React from 'react'
type option = {value: string; label: string}
type radioProps = formPropType & {
  options: option[]
}
export default function Radio(props: radioProps) {
  const {
    selectProps: {options, setter},
    customProps,
    label,
  } = useFormProps(props)
  const {name, value = ''} = customProps

  return (
    <div className={` relative `}>
      <Label required={customProps.required}>{label}</Label>
      {options?.map((option, index) => (
        <div key={index}>
          <input type="radio" value={option.value} checked={value === option.value} onChange={customProps.onChange} />
          <label>{option.label}</label>
        </div>
      ))}
    </div>
  )
}
