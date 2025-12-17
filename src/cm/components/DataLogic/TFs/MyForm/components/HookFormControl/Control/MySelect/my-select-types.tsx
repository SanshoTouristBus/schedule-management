import {optionType} from 'src/cm/class/Fields/col-operator-types'
import {ControlContextType} from '@cm/types/form-control-type'
import {JSX} from 'react'
export type MySelectContextType = {
  selectId?: any
  messageWhenNoHit?: string | JSX.Element
  isOptionsVisible?: any
  searchedInput?: any
  setsearchedInput?: any
  setIsOptionsVisible?: any
  handleOptionClick?: any
  options: optionType[]
  filteredOptions?: any
  setFilteredOptions?: any
  allowCreateOptions?: any
  COLOR?: any
  currentValueToReadableStr?: any
}

export type contextsType = {
  MySelectContextValue: MySelectContextType
  controlContextValue: ControlContextType
}
