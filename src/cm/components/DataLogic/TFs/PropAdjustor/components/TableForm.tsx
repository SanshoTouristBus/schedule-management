'use client'
import React, {useMemo} from 'react'
import {getMyTableDefault, myFormDefault} from 'src/cm/constants/defaults'
import BasicModal from '@cm/components/utils/modal/BasicModal'

import {ClientPropsType2} from '@cm/components/DataLogic/TFs/PropAdjustor/types/propAdjustor-types'
import MyTable from '@cm/components/DataLogic/TFs/MyTable/MyTable'
import MyForm from '@cm/components/DataLogic/TFs/MyForm/MyForm'

// convertProps関数を分離して最適化
const convertProps = (props: ClientPropsType2): ClientPropsType2 => {
  const myTableDefault = getMyTableDefault()

  return {
    ...props,
    myForm: {...myFormDefault, ...props.myForm, style: {...myFormDefault?.style, ...props.myForm?.style}},
    myTable: {...myTableDefault, ...props.myTable, style: {...myTableDefault?.style, ...props.myTable?.style}},
    myModal: {...props.myModal},
  } as ClientPropsType2
}

const TableForm = (props: ClientPropsType2) => {
  const ClientProps2 = convertProps(props)

  const {EditForm, myForm, myModal, setformData, formData} = props

  // ✅ オブジェクト作成なのでメモ化有効
  const modalStyle = {
    padding: '10px 10px',
    background: '#fff',
    ...myModal?.style,
  }

  // ✅ 条件分岐のあるJSX要素なのでメモ化有効
  const formComponent = useMemo(
    () => (EditForm ? <EditForm {...ClientProps2} /> : <MyForm {...ClientProps2} />),
    [EditForm, ClientProps2]
  )
  formComponent

  return (
    <div>
      <MyTable ClientProps2={ClientProps2} />
      <BasicModal
        {...{
          alertOnClose: true,
          style: modalStyle,
          open: !!formData,
          setopen: setformData,
        }}
      >
        <div id="editFormOnMyDataViwe" className={`p-1`}>
          {formComponent}
        </div>
      </BasicModal>
    </div>
  )
}

TableForm.displayName = 'TableForm'

export default TableForm
