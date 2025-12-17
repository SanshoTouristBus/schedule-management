'use client'

import React, { useRef } from 'react'
import { optionType } from 'src/cm/class/Fields/col-operator-types'
import { contextsType } from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/my-select-types'
import { SelectOption } from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/OptionSelector/SelectOption'
import { C_Stack } from 'src/cm/components/styles/common-components/common-components'

type InlineDropdownProps = {
 contexts: contextsType
 filteredOptions: optionType[]
 isVisible: boolean
 onSelect: (option: optionType) => void
 optionStyle?: any
}

export const InlineDropdown = React.memo((props: InlineDropdownProps) => {
 const { contexts, filteredOptions, isVisible, onSelect, optionStyle } = props

 const extendedOptionStyle = {
  ...optionStyle,
  width: '100%',
  maxWidth: '100%',
  maxHeight: '200px'
 }
 const scrollableRef = useRef<HTMLDivElement>(null)

 if (!isVisible) {
  return null
 }

 // nullオプション（選択解除）
 const nullOption: optionType = { id: null as any, label: '選択解除', name: '選択解除', value: null as any }

 return (
  <div
   className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-[200px] overflow-hidden"
   onMouseDown={e => e.preventDefault()}
  >
   <div
    ref={scrollableRef}
    className="overflow-y-auto max-h-[200px] shadow"
    style={{ WebkitOverflowScrolling: 'touch', }}
   >
    <C_Stack className="gap-2 p-2" >
     {/* 選択解除オプション */}
     <div
      onClick={() => onSelect(nullOption)}
      className="cursor-pointer rounded-sm hover:bg-gray-100 text-gray-500 px-2 py-1 text-sm"
     >
      選択解除
     </div>
     {/* 選択肢リスト */}
     {filteredOptions.map((option: optionType, index: number) => {
      return (
       <div
        key={option.id ?? index}
        onClick={() => onSelect(option)}
        className="cursor-pointer hover:opacity-70 rounded-sm hover:bg-gray-100"
       >
        <div className="pointer-events-none">
         <SelectOption {...{
          option, contexts, optionStyle: extendedOptionStyle
         }} />
        </div>
       </div>
      )
     })}
    </C_Stack>
   </div>
  </div>
 )
})

InlineDropdown.displayName = 'InlineDropdown'
