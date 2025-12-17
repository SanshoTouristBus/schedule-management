import {NestHandler} from '@cm/class/NestHandler'
import TableForm from '@cm/components/DataLogic/TFs/PropAdjustor/components/TableForm'
import {SurroundingComponentProps} from '@cm/components/DataLogic/TFs/PropAdjustor/types/propAdjustor-types'
import React, {useMemo} from 'react'

export const SurroundingComponent = React.memo<SurroundingComponentProps>(({type, ClientProps2}) => {
  const {PageBuilder, dataModelName} = ClientProps2

  const componentMethod = useMemo(() => {
    if (!PageBuilder) return undefined
    const getter = `${dataModelName}.${type}`
    return NestHandler.GetNestedValue(getter, PageBuilder)
  }, [PageBuilder, dataModelName, type])

  if (componentMethod) {
    return componentMethod(ClientProps2)
  }

  if (type === 'table') {
    return <TableForm {...ClientProps2} />
  }

  return null
})

SurroundingComponent.displayName = 'SurroundingComponent'
