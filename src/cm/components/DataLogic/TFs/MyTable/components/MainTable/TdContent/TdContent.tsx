import ColOption from '@cm/components/DataLogic/TFs/MyTable/components/MainTable/TdContent/ColOption/ColOption'
import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import React from 'react'

import {Fields} from '@cm/class/Fields/Fields'
import {DH__switchColType} from '@cm/class/DataHandler/type-converter'
import {colType} from '@cm/types/col-types'
import {DisplayedState} from '@cm/components/DataLogic/TFs/MyTable/components/MainTable/TdContent/childrens/DisplayedState'
import InlineEditableValue from '@cm/components/DataLogic/TFs/MyTable/components/MainTable/TdContent/InlineEditableValue'
import {UseRecordsReturn} from '@cm/components/DataLogic/TFs/PropAdjustor/hooks/useRecords/useRecords'

const TdContent = React.memo(
  (props: {
    dataModelName: string
    col: colType
    record: any
    value: any
    UseRecordsReturn?: UseRecordsReturn
    tdStyle?: React.CSSProperties
  }) => {
    const {dataModelName, col, record, value, UseRecordsReturn, tdStyle} = props

    const isEditableCell = col?.td?.editable && ![`file`].includes(DH__switchColType({type: col.type}))
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/2f19b60b-6ff5-4ce2-bb73-d9ffe580d2a6', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        location: 'TdContent.tsx:isEditableCell',
        message: 'TdContent editable check',
        data: {colId: col.id, hasTdEditable: !!col?.td?.editable, colType: col.type, isEditableCell, hasFormat: !!col.format},
        timestamp: Date.now(),
        sessionId: 'debug-session',
        hypothesisId: 'B',
      }),
    }).catch(() => {})
    // #endregion

    const showLabel = col?.isMain === undefined && Fields.doShowLabel(col)

    const Label = () => {
      return (
        <span className={`leading-[8px]`} style={{...col?.td?.style}}>
          <ColOption {...{col, dataModelName}}>{col.label}</ColOption>
        </span>
      )
    }

    const Main = (
      <div>
        {isEditableCell ? (
          <InlineEditableValue
            col={col}
            record={record}
            displayValue={value}
            dataModelName={dataModelName}
            UseRecordsReturn={UseRecordsReturn as unknown as UseRecordsReturn}
          />
        ) : (
          <DisplayedState {...{col, record, value}} />
        )}
      </div>
    )

    return (
      <div>
        {showLabel && <Label />}
        <R_Stack id="tdContentRStack">{Main}</R_Stack>
      </div>
    )
  }
)

export default TdContent
