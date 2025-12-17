import {dataMinimumServerType, dataModelNameType, form_table_modal_config, PageBuilderGetterType} from '@cm/types/types'
import {anyObject} from '@cm/types/utility-types'
import {UseRecordsReturn} from '@cm/components/DataLogic/TFs/PropAdjustor/hooks/useRecords/useRecords'

import {getInitModelRecordsProps, serverFetchProps} from '@cm/components/DataLogic/TFs/Server/fetchers/getInitModelRecordsProps'
import {surroundings} from '@cm/components/DataLogic/types/customParams-types'
import {useGlobalPropType} from '@cm/hooks/globalHooks/useGlobal'
import {CSSProperties} from 'react'

export interface PropAdjustorPropsType {
  ClientProps: ClientPropsType
  serverFetchProps: serverFetchProps
  initialModelRecords: Awaited<ReturnType<typeof getInitModelRecordsProps>>
  fetchTime: Date
}

export type ClientPropsType = {
  params: anyObject
  dataModelName: dataModelNameType
  surroundings?: surroundings
  displayStyle?: CSSProperties
  DetailePageId?: any
  redirectPath?: any
  EasySearchBuilder?: any
  ColBuilder?: anyObject
  PageBuilder?: anyObject
  ViewParamBuilder?: anyObject
  ColBuilderExtraProps?: anyObject
  PageBuilderExtraProps?: anyObject
  easySearchPrismaDataOnServer?: anyObject
  easySearchExtraProps?: anyObject
  serverFetchihngData?: anyObject
  include?: anyObject
} & dataMinimumServerType &
  form_table_modal_config & {
    PageBuilderGetter?: PageBuilderGetterType
  }

export interface ClientPropsType2 extends ClientPropsType {
  UseRecordsReturn?: UseRecordsReturn
  useGlobalProps: useGlobalPropType
  columns: any
  formData: any
  setformData: any
  records: any
  setrecords: any
  totalCount: number
  mutateRecords: any
  deleteRecord: any
}

export interface UsePropAdjustorLogicProps {
  ClientProps: ClientPropsType
  serverFetchProps: serverFetchProps
  initialModelRecords: Awaited<ReturnType<typeof getInitModelRecordsProps>>
  fetchTime: Date
}

export interface SurroundingComponentProps {
  type: 'top' | 'left' | 'table' | 'right' | 'bottom'
  ClientProps2: ClientPropsType2
}

export type ViewParamBuilderProps = (props: {ClientProps: ClientPropsType; useGlobalProps: useGlobalPropType}) => {
  [key in keyof ClientPropsType]?: ClientPropsType[key]
}
