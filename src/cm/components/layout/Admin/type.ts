import {PageBuilderGetterType} from '@cm/types/types'

import {getPathItemRelatedProps} from '@cm/components/layout/Admin/hooks/useAdminContext'
import {useGlobalPropType} from '@cm/hooks/globalHooks/useGlobalOrigin'

export type adminProps = {
  AppName: string | React.ReactNode
  Logo?: any
  PagesMethod: string
  children?: React.ReactNode
  additionalHeaders?: React.ReactNode[]
  PageBuilderGetter?: PageBuilderGetterType
  showLogoOnly?: boolean
  ModelBuilder?: any
  getTopPageLink?: getTopPageLinkType
  navBarPosition?: 'left' | 'top'
}
export type getTopPageLinkType = (props: {session: any}) => string

export type menuContext = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  toggleMenu: () => void
  MenuButton: React.ReactNode
}

export type adminContext = adminProps & {
  horizontalMenu: boolean
  pathItemObject: ReturnType<typeof getPathItemRelatedProps>
  useGlobalProps: useGlobalPropType
  getTopPageLink?: (props: {session: any}) => string
  menuContext: menuContext
}

export type AccessValidationResult = {
  isValid: boolean
  redirectPath?: string
  needsRedirect: boolean
}

export type CheckValidAccessProps = {
  pathname: string
  origin: string
  allPathsPatterns: any[]
}
