import {ViewParamBuilderProps} from '@cm/components/DataLogic/TFs/PropAdjustor/types/propAdjustor-types'

export const useMergeWithCustomViewParams = ({source, useGlobalProps}) => {
  const CustomViewParamsMethod: ViewParamBuilderProps = source.ViewParamBuilder?.[source.dataModelName]
  const CustomViewParams = CustomViewParamsMethod?.({ClientProps: source, useGlobalProps})
  if (CustomViewParams) {
    Object.keys(source).forEach(key => {
      if (CustomViewParams[key]) {
        source[key] = {
          ...source[key],
          ...CustomViewParams[key],
        }
      }
    })
  }
}
// export const useMergeWithCustomViewParams = ClientProps => {
//   const {dataModelName, ViewParamBuilder} = ClientProps ?? {}
//   const CustomViewParamsMethod: ViewParamBuilderProps = ViewParamBuilder?.[dataModelName]

//   const CustomViewParams = CustomViewParamsMethod?.({ClientProps})

//   Object.keys(CustomViewParams ?? {}).forEach(key => {
//     ClientProps[key] = {
//       ...ClientProps[key],
//       ...CustomViewParams[key],
//     }
//   })

//   return ClientProps
// }
