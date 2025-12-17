'use client'

import { ColBuilder } from '../(builders)/ColBuilder'
import { DetailPagePropType } from '@cm/types/types'
import ChildCreator from '@cm/components/DataLogic/RTs/ChildCreator/ChildCreator'
import MyForm from '@cm/components/DataLogic/TFs/MyForm/MyForm'
import { R_Stack } from '@cm/components/styles/common-components/common-components'
import MyAccordion from '@cm/components/utils/Accordions/Accordion'
import { useGlobalPropType } from '@cm/hooks/globalHooks/useGlobal'
import { Fields } from '@cm/class/Fields/Fields'
import { globalIds } from 'src/non-common/searchParamStr'
import GlobalIdSelector from '@cm/components/GlobalIdSelector/GlobalIdSelector'
import { DataModelBuilder, roleMaster } from '@cm/class/builders/PageBuilderVariables'

export class PageBuilder {


  // 車両マスタ詳細ページ
  static stVehicle = {
    form: (props: DetailPagePropType) => {
      return (
        <R_Stack className="max-w-xl items-stretch">
          <div className="w-full">
            <MyAccordion {...{ label: '車両情報', defaultOpen: true, closable: true }}>
              <MyForm {...{ ...props }} />
            </MyAccordion>
          </div>
        </R_Stack>
      )
    },
  }

  // 会社マスタ詳細ページ
  static stCustomer = {
    form: (props: DetailPagePropType) => {
      return (
        <R_Stack className="max-w-xl items-stretch">
          <div className="w-full">
            <MyAccordion {...{ label: '会社情報', defaultOpen: true, closable: true }}>
              <MyForm {...{ ...props }} />
            </MyAccordion>
          </div>
          <div className="w-full">
            <MyAccordion {...{ label: '担当者', defaultOpen: true, closable: true }}>
              <ChildCreator
                {...{
                  ParentData: props.formData ?? {},
                  models: {
                    parent: props.dataModelName,
                    children: 'stContact',
                  },
                  columns: ColBuilder.stContact(props),
                  useGlobalProps: props.useGlobalProps,
                }}
              />
            </MyAccordion>
          </div>
        </R_Stack>
      )
    },
  }

  // 担当者マスタ詳細ページ
  static stContact = {
    form: (props: DetailPagePropType) => {
      return (
        <R_Stack className="max-w-xl items-stretch">
          <div className="w-full">
            <MyAccordion {...{ label: '担当者情報', defaultOpen: true, closable: true }}>
              <MyForm {...{ ...props }} />
            </MyAccordion>
          </div>
        </R_Stack>
      )
    },
  }

  // 祝日マスタ詳細ページ
  static stHoliday = {
    form: (props: DetailPagePropType) => {
      return (
        <R_Stack className="max-w-xl items-stretch">
          <div className="w-full">
            <MyAccordion {...{ label: '祝日情報', defaultOpen: true, closable: true }}>
              <MyForm {...{ ...props }} />
            </MyAccordion>
          </div>
        </R_Stack>
      )
    },
  }

  // 乗務員マスタ詳細ページ
  static stDriver = {
    form: (props: DetailPagePropType) => {
      return (
        <R_Stack className="max-w-xl items-stretch">
          <div className="w-full">
            <MyAccordion {...{ label: '乗務員情報', defaultOpen: true, closable: true }}>
              <MyForm {...{ ...props }} />
            </MyAccordion>
          </div>
        </R_Stack>
      )
    },
  }

  static roleMaster: DataModelBuilder = roleMaster
  static getGlobalIdSelector = (props: { useGlobalProps: useGlobalPropType }) => {
    const { useGlobalProps } = props
    const { admin, } = useGlobalProps.accessScopes()


    const columns = new Fields([
      {
        id: globalIds.globalUserId,
        label: 'ユーザー',
        forSelect: {
          config: {
            modelName: 'user',
          }
        },
        form: { style: { width: 85 } }
      },

    ]).transposeColumns()


    if (admin) {
      return () => <GlobalIdSelector {...{ useGlobalProps, columns }} />
    }
  }
}
