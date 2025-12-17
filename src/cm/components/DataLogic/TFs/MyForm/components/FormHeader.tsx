import React, {useMemo} from 'react'

type FormHeaderProps = {
  myForm: {
    showHeader?: (formData: any) => React.ReactNode
  }
  formData: any
}

const FormHeader = React.memo(({myForm, formData}: FormHeaderProps) => {
  // ヘッダーコンテンツをメモ化
  const headerContent = useMemo(() => {
    if (!myForm.showHeader) {
      return null
    }
    return myForm.showHeader(formData)
  }, [myForm.showHeader, formData])

  if (!headerContent) {
    return null
  }

  return <div className="bg-white p-2">{headerContent}</div>
})

FormHeader.displayName = 'FormHeader'

export default FormHeader
