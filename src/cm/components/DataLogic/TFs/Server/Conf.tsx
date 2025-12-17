import {ClientPropsType} from '@cm/components/DataLogic/TFs/PropAdjustor/types/propAdjustor-types'
import {getInitModelRecordsProps, serverFetchProps} from '@cm/components/DataLogic/TFs/Server/fetchers/getInitModelRecordsProps'
import {server_getPathname} from 'src/non-common/serverSideFunction'
export type prismaDataExtractionQueryType = {
  where?: any
  include?: any
  orderBy?: any
  select?: any
  omit?: any
  take?: number
  skip?: number
}

//関数
export const Conf = async props => {
  const {pathName, rootPath} = await server_getPathname()

  const {params, session, query, customParams, ColBuilder, ViewParamBuilder, PageBuilder, QueryBuilder} = props
  const {dataModelName, additional, QueryBuilderExtraProps, easySearchExtraProps, myTable} = customParams ?? {}
  const include = QueryBuilder.getInclude({session, query, QueryBuilderExtraProps})?.[dataModelName]?.include

  const ClientProps: ClientPropsType = {
    params,
    ...{ColBuilder, ViewParamBuilder, PageBuilder},
    ...customParams,
    include,
  }

  const serverFetchProps: serverFetchProps = {
    DetailePageId: params?.[`id`] ? Number(params?.[`id`]) : undefined,
    dataModelName,
    additional,
    myTable,
    include,
    session,
    easySearchExtraProps,
  }

  const initialModelRecords = await getInitModelRecordsProps({
    ...serverFetchProps,
    query,
    rootPath,
    env: 'conf',
  })

  const fetchTime = new Date()

  return {
    fetchTime,
    initialModelRecords,
    ClientProps,
    serverFetchProps,
  }
}
