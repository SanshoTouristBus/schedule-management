import {additionalPropsType} from '@cm/types/types'
import {useMemo} from 'react'

// 型定義を追加
interface UseAdditionalProps {
  additional: additionalPropsType
  prismaDataExtractionQuery: {
    include?: any
  }
}

export default function useAdditional({additional, prismaDataExtractionQuery}: UseAdditionalProps): additionalPropsType {
  // ✅ オブジェクト作成（スプレッド演算子）なのでメモ化有効
  return useMemo(
    () => ({
      ...additional,
      include: {
        ...additional?.include,
        ...prismaDataExtractionQuery.include,
      },
    }),
    [additional, prismaDataExtractionQuery.include]
  )
}
