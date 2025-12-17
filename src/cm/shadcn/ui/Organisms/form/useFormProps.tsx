import {SelectProps} from '@shadcn/ui/Organisms/form/Select'

export default function useFormProps(props: formPropType & Partial<SelectProps>) {
  const {options, setter, selectType, arrowEmpty, label, flexMode, ...rest} = props
  const isfilled = rest.value !== undefined && rest.value !== '' && rest.value !== null ? true : false
  const isEmpty = rest.required && !isfilled

  const className = [
    //

    // 'bg-inherit',
    isEmpty && 'border-red-500 bg-red-50',
    isfilled && 'bg-blue-50',
    // classStr.control.main,
    rest.className,
  ].join(' ')

  return {
    selectProps: {options, setter, selectType, arrowEmpty, flexMode},
    customProps: {
      ...rest,
      onChange: rest.onChange ?? (() => {}),
      value: rest.value ? String(rest.value) : '',
      className,
    },
    label,
    isfilled,
    isEmpty,
  }
}
