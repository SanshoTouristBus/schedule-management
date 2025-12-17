import {useMemo} from 'react'

import {useMergeWithCustomViewParams} from '@cm/components/DataLogic/TFs/PropAdjustor/hooks/usePropAdjusctorLogic/useMergeWithCustomViewParams'
import useColumns from '@cm/components/DataLogic/TFs/PropAdjustor/hooks/usePropAdjusctorLogic/useColumns'
import useRecords, {UseRecordsReturn} from '@cm/components/DataLogic/TFs/PropAdjustor/hooks/useRecords/useRecords'
import useInitFormState from '@cm/hooks/useInitFormState'
import useEditForm from '@cm/components/DataLogic/TFs/PropAdjustor/hooks/usePropAdjusctorLogic/useEditForm'
import {checkShowHeader} from '@cm/components/DataLogic/TFs/PropAdjustor/hooks/usePropAdjusctorLogic/useMyTable'
import useGlobal from '@cm/hooks/globalHooks/useGlobal'

import {
  ClientPropsType2,
  UsePropAdjustorLogicProps,
} from '@cm/components/DataLogic/TFs/PropAdjustor/types/propAdjustor-types'

// usePropAdjustorLogic
export const usePropAdjustorLogic = ({
  ClientProps,
  serverFetchProps,
  initialModelRecords,
  fetchTime,
}: UsePropAdjustorLogicProps) => {
  const useGlobalProps = useGlobal()

  //viewParamBuilderとのマージ
  useMergeWithCustomViewParams({source: ClientProps, useGlobalProps})

  const UseRecordsReturn: UseRecordsReturn = useRecords({
    dataModelName: ClientProps.dataModelName,
    serverFetchProps,
    initialModelRecords,
    fetchTime,
    countPerPage: ClientProps.myTable?.pagination?.countPerPage,
  })

  const {prismaDataExtractionQuery, easySearchPrismaDataOnServer} = UseRecordsReturn

  const modelData = useMemo(() => UseRecordsReturn?.records?.[0], [UseRecordsReturn?.records])

  const {formData, setformData} = useInitFormState(null, [modelData], false, ClientProps.dataModelName)

  const columns = useColumns({
    useGlobalProps,
    UseRecordsReturn,
    dataModelName: ClientProps.dataModelName,
    ColBuilder: ClientProps.ColBuilder,
    ColBuilderExtraProps: ClientProps.ColBuilderExtraProps,
  })

  const additional = {
    ...ClientProps.additional,
    include: {
      ...ClientProps.additional?.include,
      ...prismaDataExtractionQuery.include,
    },
  }
  const EditForm = useEditForm({
    PageBuilderGetter: ClientProps.PageBuilderGetter,
    PageBuilder: ClientProps.PageBuilder,
    dataModelName: ClientProps.dataModelName,
  })

  const myTable = {
    ...ClientProps.myTable,
    style: {...ClientProps.displayStyle, ...ClientProps.myTable?.style},
    showHeader: checkShowHeader({myTable: ClientProps.myTable, columns}),
  }

  const ClientProps2: ClientPropsType2 = {
    ...ClientProps,
    ...UseRecordsReturn,
    additional,
    EditForm,
    myTable,
    useGlobalProps,
    columns,
    formData,
    setformData,
    UseRecordsReturn,
    prismaDataExtractionQuery,
  }

  // 再度マージ
  useMergeWithCustomViewParams({source: ClientProps2, useGlobalProps})

  return {
    ClientProps2,
    UseRecordsReturn,
    modelData,
    easySearchPrismaDataOnServer,
    useGlobalProps,
  }
}
