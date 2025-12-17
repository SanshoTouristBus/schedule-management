import { generalDoStandardPrisma } from '@cm/lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'
import { optionType } from 'src/cm/class/Fields/col-operator-types'
import { ForSelectConfig } from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/Class/ForSelectConfig'
import { OrSearchArray } from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/Class/OrSearchArray'

import { scaleUpWhereQueryForOptionSearch } from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/lib/MySelectMethods-client'
import { mapAdjustOptionValue } from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/lib/MySelectMethods-server'
import { contextsType } from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/my-select-types'
import { generateUnivesalApiParamsForSelect } from 'src/cm/hooks/useCacheSelectOptions/lib/generateUnivesalApiParamsForSelect'

export const updateOptionsOrigin = async ({ input, options, isStaticOptions, contexts }) => {
  const { controlContextValue, MySelectContextValue } = contexts as contextsType
  const { setsearchedInput, setFilteredOptions } = MySelectContextValue
  const { col, latestFormData } = controlContextValue

  setsearchedInput(input)
  let hits: optionType[] = []
  if (isStaticOptions === false) {
    hits = await getHitsByFetch()
    console.debug(`getHitsByFetch`, hits)
  }

  if (hits.length === 0) {
    hits = await getHitsFromOptions()
    console.debug(`getHitsFromOptions`, hits)
  }

  setFilteredOptions(hits)

  async function getHitsFromOptions() {
    const firstFilter: optionType[] = (options ?? []).filter(option => {
      const inputVersions = OrSearchArray.getLetterVariationArr(input)

      const hit = inputVersions.find(obj => {
        const { value, type } = obj





        const searchValueInLowerCase = String(value).toLowerCase()

        // nameとlabelの両方を検索対象にする
        const optionName = String(option?.['name'] ?? '').toLowerCase()
        const optionLabel = String(option?.['label'] ?? '').toLowerCase()

        const isHit = optionName.includes(searchValueInLowerCase) || optionLabel.includes(searchValueInLowerCase)



        return isHit
      })

      return hit
    })

    return firstFilter
  }

  async function getHitsByFetch() {
    try {
      const UnivesalApiParamsForSelect = generateUnivesalApiParamsForSelect({ col, latestFormData })
      const { model, method, queryObject } = UnivesalApiParamsForSelect

      const { selectWithColType, where, nameChanger } = new ForSelectConfig(col, { latestFormData }).getConfig()

      const searchNotationVersions = OrSearchArray.getLetterVariationArr(input)

      const AND = scaleUpWhereQueryForOptionSearch({ where, select: selectWithColType, searchNotationVersions })

      queryObject[`where`] = { AND }

      queryObject[`take`] = undefined
      const payload = { model: model, method, queryObject }

      // //doStandardPrismaを使うと、なぜかサイレンダリングが起き、モーダルが閉じる
      // const res = await fetchAlt(`${basePath}/api/prisma/universal`, payload)
      const res = await generalDoStandardPrisma(model, method, queryObject)

      const { result = [], message } = res

      let newOptions: optionType[] = result

      if (nameChanger) {
        newOptions = newOptions.map(option => nameChanger(option))
      }

      newOptions = mapAdjustOptionValue(newOptions)
      return newOptions
    } catch (error) {
      return []
    }
  }
}
