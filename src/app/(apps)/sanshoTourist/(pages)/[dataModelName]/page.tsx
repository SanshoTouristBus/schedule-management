//classを切り替える

import { setCustomParams } from '@cm/components/DataLogic/helpers/SetCustomParams'

import { getScopes } from 'src/non-common/scope-lib/getScopes'
import { PageBuilder } from '../../(builders)/PageBuilder'
import { ColBuilder } from '../../(builders)/ColBuilder'
import { QueryBuilder } from '../../(builders)/QueryBuilder'

import { ViewParamBuilder } from '../../(builders)/ViewParamBuilder'
import { getMasterPageCommonConfig } from '@cm/components/DataLogic/helpers/getMasterPageCommonConfig'

export default async function DynamicMasterPage(props) {
  return getMasterPageCommonConfig({
    nextPageProps: props,
    parameters,
    ColBuilder,
    ViewParamBuilder,
    PageBuilder,
    QueryBuilder,
  })
}

const parameters = async (props: { params; query; session; scopes: ReturnType<typeof getScopes> }) => {
  const { params, query, session, scopes } = props

  //---------------個別設定-------------
  const customParams = await setCustomParams({
    dataModelName: params.dataModelName,
    variants: [
      // 車両マスタ
      {
        modelNames: ['stVehicle'],
        setParams: async () => {
          return {
            additional: {
              payload: [],
              where: { active: true },
              orderBy: [{ sortOrder: 'asc' }],
            },
          }
        },
      },
      // 会社マスタ
      {
        modelNames: ['stCustomer'],
        setParams: async () => {
          return {
            additional: {
              payload: [],
              where: { active: true },
              orderBy: [{ sortOrder: 'asc' }],
            },
          }
        },
      },
      // 担当者マスタ
      {
        modelNames: ['stContact'],
        setParams: async () => {
          return {
            additional: {
              payload: [],
              where: { active: true },
              orderBy: [{ sortOrder: 'asc' }],
            },
          }
        },
      },
      // 祝日マスタ
      {
        modelNames: ['stHoliday'],
        setParams: async () => {
          return {
            additional: {
              payload: [],
              orderBy: [{ date: 'asc' }],
            },
          }
        },
      },
      // ユーザー (乗務員はUserテーブルを利用)
      {
        modelNames: ['user'],
        setParams: async () => {
          return {
            additional: {
              payload: {
                apps: ['sanshoTourist'],
              },
              where: { apps: { has: 'sanshoTourist' } },

            },
          }
        },
      },
      {
        modelNames: ['roleMaster'],
        setParams: async () => {
          return {
            myTable: {
              create: false,
              update: false,
              delete: false,
            }
          }
        },
      },
    ],
  })
  return customParams
}
