'use client'

import {ViewParamBuilderProps} from '@cm/components/DataLogic/TFs/PropAdjustor/types/propAdjustor-types'

export class ViewParamBuilder {
  // 車両マスタ
  static stVehicle: ViewParamBuilderProps = props => {
    return {
      myTable: {
        create: {
          defaultRecordBtnHidden: true,
        },
      },
    }
  }

  // 会社マスタ
  static stCustomer: ViewParamBuilderProps = props => {
    return {
      myTable: {
        create: {
          defaultRecordBtnHidden: true,
        },
      },
    }
  }

  // 担当者マスタ
  static stContact: ViewParamBuilderProps = props => {
    return {
      myTable: {
        create: {
          defaultRecordBtnHidden: true,
        },
      },
    }
  }

  // 祝日マスタ
  static stHoliday: ViewParamBuilderProps = props => {
    return {
      myTable: {
        create: {
          defaultRecordBtnHidden: true,
        },
      },
    }
  }

  // 乗務員マスタ
  static stDriver: ViewParamBuilderProps = props => {
    return {
      myTable: {
        create: {
          defaultRecordBtnHidden: true,
        },
      },
    }
  }

  // スケジュール
  static stSchedule: ViewParamBuilderProps = props => {
    return {
      myTable: {
        create: {
          defaultRecordBtnHidden: true,
        },
      },
    }
  }

  // 公開範囲設定
  static stPublishSetting: ViewParamBuilderProps = props => {
    return {
      myTable: {
        create: {
          defaultRecordBtnHidden: true,
        },
      },
    }
  }

  // ユーザー
  static user: ViewParamBuilderProps = props => {
    return {}
  }
}
