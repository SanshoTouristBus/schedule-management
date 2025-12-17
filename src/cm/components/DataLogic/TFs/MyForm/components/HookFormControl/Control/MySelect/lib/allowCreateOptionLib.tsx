import {Fields} from 'src/cm/class/Fields/Fields'
import {getItems} from '@cm/types/types'
import {ForSelectConfig} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/Class/ForSelectConfig'
import {OrSearchArray} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/Class/OrSearchArray'
import {parseContexts} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/lib/useInitMySelect'
import {generalDoStandardPrisma} from '@cm/lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'

export const getAllowCreateDefault = ({contexts}) => {
  const {latestFormData} = parseContexts(contexts)
  const dataModeName = contexts.controlContextValue.col?.forSelect?.config?.modelName

  const SearchFunc = () => {
    const getSearchFormProps = () => {
      const columns = new Fields([{id: `name`, label: ``, form: {}}]).transposeColumns()
      return {columns, formData: {}}
    }

    const getItems: getItems = async props => {
      const col = props.col

      const {selectWithColType, where} = new ForSelectConfig(col, {latestFormData}).getConfig()

      const OR = OrSearchArray.mapGetOrQuery({
        select: selectWithColType,
        object: {name: props.searchFormData.name},
      })

      const {result} = await generalDoStandardPrisma(dataModeName, `findMany`, {where: {...where, OR}})

      return {optionsHit: result, searchFormData: props.searchFormData}
    }

    return {getSearchFormProps, getItems}
  }
  const CreateFunc = () => {
    const getCreatFormProps = () => {
      const columns = new Fields([{id: `name`, label: ``, form: {}}]).transposeColumns()
      return {columns, formData: {}}
    }

    return {getCreatFormProps}
  }
  return {SearchFunc, CreateFunc}
}
