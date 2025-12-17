import {nextPageProps} from '@cm/types/utility-types'
import PropAdjustor from '@cm/components/DataLogic/TFs/PropAdjustor/PropAdjustor'
import {Conf} from '@cm/components/DataLogic/TFs/Server/Conf'
import React from 'react'
import {initServerComopnent} from 'src/non-common/serverSideFunction'

export const getMasterPageCommonConfig = async (props: {
  nextPageProps: nextPageProps
  parameters: any
  ColBuilder: any
  ViewParamBuilder: any
  PageBuilder: any
  QueryBuilder: any
}) => {
  const query = await props.nextPageProps.searchParams
  const params = await props.nextPageProps.params
  const {session, scopes} = await initServerComopnent({query})
  const customParams = await props.parameters({params, query, session, scopes})
  const conf = await Conf({
    params,
    session,
    query,
    customParams,
    ColBuilder: props.ColBuilder,
    ViewParamBuilder: props.ViewParamBuilder,
    PageBuilder: props.PageBuilder,
    QueryBuilder: props.QueryBuilder,
  })

  return <PropAdjustor {...conf} />
}
