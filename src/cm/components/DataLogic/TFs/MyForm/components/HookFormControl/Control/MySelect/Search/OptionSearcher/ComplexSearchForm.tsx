'use client'

import {R_Stack} from 'src/cm/components/styles/common-components/common-components'

import React, {useEffect} from 'react'
import {contextsType} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/my-select-types'
import {useSearchForm} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/Search/OptionSearcher/useSearchForm'
import {Button} from 'src/cm/components/styles/common-components/Button'
export const ComplexSearchForm = ({contexts, SearchFormHook}) => {
  const {handleSeachOption} = SearchFormHook
  const {MySelectContextValue, controlContextValue} = contexts as contextsType
  const {setFilteredOptions} = MySelectContextValue
  useEffect(() => {
    SearchFormHook.ReactHookForm.setFocus(SearchFormHook.firstCol.id)
  }, [])

  return (
    <R_Stack
      onKeyDown={e => {
        if (e.key === 'Enter') {
          handleSeachOption()
        }
      }}
    >
      <SearchFormHook.Form
        {...{
          ControlOptions: {
            ControlStyle: {
              width: 170,
            },
          },
          onSubmit: async e => {
            e.preventDefault()
            e.stopPropagation()
            handleSeachOption()
          },
        }}
        alignMode="row"
      ></SearchFormHook.Form>

      <Button className={`text-sm`} color={`blue`} onClick={handleSeachOption}>
        検索
      </Button>
      <Button className={`text-sm`} onClick={e => setFilteredOptions(MySelectContextValue.options)}>
        取消
      </Button>
    </R_Stack>
  )
}

export type SearchFormHookType = ReturnType<typeof useSearchForm>
