import {NestHandler} from '@cm/class/NestHandler'
import {useMemo} from 'react'

// 型定義を追加
interface UseEditFormProps {
  PageBuilderGetter?: {
    class: any
    getter: string
  }
  PageBuilder?: any
  dataModelName: string
}

// PageBuilderGetter作成を分離
const createPageBuilderGetter = (
  PageBuilderGetter: UseEditFormProps['PageBuilderGetter'],
  PageBuilder: any,
  dataModelName: string
) => {
  return (
    PageBuilderGetter ?? {
      class: PageBuilder,
      getter: `${dataModelName}.form`,
    }
  )
}

export default function useEditForm({PageBuilderGetter, PageBuilder, dataModelName}: UseEditFormProps) {
  // ✅ NestHandler.GetNestedValueは重い処理なのでメモ化有効
  return useMemo(() => {
    const builderGetter = createPageBuilderGetter(PageBuilderGetter, PageBuilder, dataModelName)
    const {getter} = builderGetter

    return NestHandler.GetNestedValue(getter, builderGetter['class'])
  }, [PageBuilderGetter, PageBuilder, dataModelName])
}
