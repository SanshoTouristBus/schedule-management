import useBasicFormProps from 'src/cm/hooks/useBasicForm/useBasicFormProps'
import {mapAdjustOptionValue} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/lib/MySelectMethods-server'
import {optionType} from 'src/cm/class/Fields/col-operator-types'
import {contextsType} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/my-select-types'
import {makeOptionCreatorProps} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/lib/useInitMySelect'
import {getAllowCreateDefault} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/lib/allowCreateOptionLib'
import {forSelcetType} from '@cm/types/select-types'

export const useSearchForm = ({contexts}) => {
  const SearchFuncDefault = getAllowCreateDefault({contexts}).SearchFunc()
  const OptionCreatorProps = makeOptionCreatorProps(contexts)
  const {MySelectContextValue, controlContextValue} = contexts as contextsType
  const {setsearchedInput, setFilteredOptions} = MySelectContextValue

  const {col} = controlContextValue

  const SearchFunc = col.forSelect?.searcher?.(OptionCreatorProps)

  //検索フォームのカラムを取得する
  const GET_SEARCH_FORM_INIT_DATA = SearchFunc?.getSearchFormProps ?? SearchFuncDefault.getSearchFormProps

  const {columns, formData} = GET_SEARCH_FORM_INIT_DATA()

  //検索メソッドを取得する
  const GET_ITEM_FUNC = SearchFunc?.getItems ?? SearchFuncDefault.getItems

  const forSelect = col.forSelect as forSelcetType
  const SearchFormHook = useBasicFormProps({columns, formData})

  const handleSeachOption = async () => {
    const searchFormData = SearchFormHook.latestFormData
    const dataNotInput = Object.values(searchFormData).every(v => !v)

    if (dataNotInput) {
      setFilteredOptions(MySelectContextValue.options)
    } else {
      let {optionsHit} = await GET_ITEM_FUNC({searchFormData, ...OptionCreatorProps})

      if (forSelect.config?.nameChanger) {
        optionsHit = optionsHit.map(op => {
          return forSelect.config?.nameChanger?.(op) ?? op
        })
      }

      const newOptions: optionType[] = mapAdjustOptionValue(optionsHit)

      setFilteredOptions(newOptions)
      setsearchedInput(``)
    }
  }

  return {
    handleSeachOption,
    Form: SearchFormHook.BasicForm,
    searchFormData: SearchFormHook.latestFormData,
    ReactHookForm: SearchFormHook.ReactHookForm,
    firstCol: columns.flat().flat()[0],
  }
}
