// import _ from 'lodash'
import {isEqual} from 'lodash'
export type useCacheSelectOptionReturnType = ReturnType<typeof useCacheSelectOptions>

import {optionType} from 'src/cm/class/Fields/col-operator-types'
import {getCols} from 'src/cm/hooks/useCacheSelectOptions/lib/getCols'
import {useEffect, useState} from 'react'
import {OptionsFromArray} from 'src/cm/hooks/useCacheSelectOptions/lib/OptionsFromArray'
import {OptionsFromAutoFetch} from 'src/cm/hooks/useCacheSelectOptions/lib/OptionsFromAutoFetchOptionsFromAutoFetch'
import {OptionsFromMannualFetch} from 'src/cm/hooks/useCacheSelectOptions/lib/OptionsFromMannualFetch'

const useCacheSelectOptions = ({columns, latestFormData, startFetchingOptions}) => {
  if (startFetchingOptions) {
    const [allOptionsState, setallOptionsState] = useState<allOptionType | null>(null)

    //columnsからoptionsを作成するための情報を取得
    const {givenArrayCols, SWR_REQUEST_PARAMS, manualFetcheTargetCols, CacheKeys} = getCols({columns, latestFormData})

    // 配列からoptionsを形成
    const Array_OP = OptionsFromArray({givenArrayCols})

    // /**SWRでoptionsを作る */
    const Fetch_OP = OptionsFromAutoFetch({CacheKeys, SWR_REQUEST_PARAMS, columns})

    // // //マニュアルでoptionsを作成
    const Mannual_OP = OptionsFromMannualFetch({CacheKeys, manualFetcheTargetCols, latestFormData})

    type allOptionType = {
      [key: string]: optionType[]
    }
    const allOptionsOrigin: allOptionType = {...Array_OP, ...Fetch_OP, ...Mannual_OP}

    const allOptions = allOptionsState ?? allOptionsOrigin

    useEffect(() => {
      const isSame = isEqual(allOptionsState, allOptionsOrigin)
      if (!isSame) {
        setallOptionsState(allOptionsOrigin)
      }
    }, [allOptionsOrigin])

    return {
      allOptionsOrigin,
      allOptions: allOptions,
      valueHasChanged: JSON.stringify(allOptions),
      allOptionsState,
      setallOptionsState,
    }
  } else {
    return {allOptions: {}}
  }
}

export default useCacheSelectOptions
