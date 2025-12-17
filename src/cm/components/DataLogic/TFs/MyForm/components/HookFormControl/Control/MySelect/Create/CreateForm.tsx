'use client'

import {PrismaModelNames} from '@cm/types/prisma-types'
import {requestResultType} from '@cm/types/types'
import {getAllowCreateDefault} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/lib/allowCreateOptionLib'
import {mapAdjustOptionValue} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/lib/MySelectMethods-server'
import {parseContexts} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/lib/useInitMySelect'
import {contextsType} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/my-select-types'
import {SearchFormHookType} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/Search/OptionSearcher/ComplexSearchForm'
import {Button} from 'src/cm/components/styles/common-components/Button'

import useBasicFormProps from 'src/cm/hooks/useBasicForm/useBasicFormProps'

import React, {useEffect} from 'react'
import {toastByResult} from '@cm/lib/ui/notifications'
import {generalDoStandardPrisma} from '@cm/lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'

export default function OptionCreateForm(props: {SearchFormHook: SearchFormHookType; contexts: contextsType}) {
  const {SearchFormHook, contexts} = props
  const col = contexts.controlContextValue.col
  const {controlContextValue} = contexts
  const {options, setFilteredOptions, handleOptionClick} = parseContexts(contexts)

  const creator = col.forSelect?.allowCreateOptions?.creator

  const createSeldctItem = async (res: requestResultType) => {
    const newOptionObj = res.result
    const newOptions = mapAdjustOptionValue([newOptionObj])
    newOptions.shift()
    setFilteredOptions(options)
    await handleOptionClick(newOptionObj, newOptions)
    toastByResult(res)
  }

  const getCreateFormPropsMethod =
    creator?.().getCreatFormProps ?? getAllowCreateDefault({contexts})?.CreateFunc().getCreatFormProps

  const {columns, formData} =
    getCreateFormPropsMethod({...controlContextValue, searchFormData: SearchFormHook.searchFormData}) ?? {}

  const useCreateForm = useBasicFormProps({columns, formData: {...formData}})

  const firstCol = columns.flat()[0]

  useEffect(() => {
    SearchFormHook.ReactHookForm.setFocus(firstCol.id)
  }, [])

  return (
    <div className={`mx-auto w-fit `}>
      <useCreateForm.BasicForm
        latestFormData={useCreateForm.latestFormData}
        onSubmit={async data => {
          if (confirm(`新規にマスタデータを作成しますか?`) === false) return
          const modelName = controlContextValue.col.id.replace('Id', '') as PrismaModelNames
          const res = await generalDoStandardPrisma(modelName, 'create', {
            data,
          })

          res.result = {id: res.result.id, name: res.result.name}

          await createSeldctItem(res)
        }}
      >
        <Button>新規作成</Button>
      </useCreateForm.BasicForm>
    </div>
  )
}
