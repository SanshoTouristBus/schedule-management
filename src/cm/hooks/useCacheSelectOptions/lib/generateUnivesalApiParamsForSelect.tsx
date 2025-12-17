'use client'

import {convertColIdToModelName} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/lib/MySelectMethods-server'
import {optionTakeCount} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/OptionSelector/OptionSelector'

import {GetCaheOptionSWR_REQUEST_PARAMS} from '@cm/lib/server-actions/common-server-actions/serverGetCaheOptions'

import {ForSelectConfig} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/Class/ForSelectConfig'
import {forSelectConfig} from '@cm/types/select-types'

export const generateUnivesalApiParamsForSelect = ({col, latestFormData}) => {
  const config: forSelectConfig = col?.forSelect?.config ?? {}
  const modelName = config?.modelName ? config?.modelName : convertColIdToModelName({col})

  const {select, orderBy, where, include} = new ForSelectConfig(col, {latestFormData}).getConfig()

  const queryObject = {select, where, orderBy, take: optionTakeCount}

  if (include) {
    delete queryObject[`select`]
    queryObject[`include`] = include
  }

  const doStandardPrismaPasrams: GetCaheOptionSWR_REQUEST_PARAMS = {
    col,
    colId: col.id,
    model: modelName,
    method: 'findMany',
    queryObject,
  }

  return doStandardPrismaPasrams
}
