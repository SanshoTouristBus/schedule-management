'use client'

import { defaultRegister } from '@cm/class/builders/ColBuilderVariables'
import { Fields } from '@cm/class/Fields/Fields'
import { columnGetterType } from '@cm/types/types'
import { getMidnight } from '@cm/class/Days/date-utils/calculations'

export class ColBuilder {
  // 車両マスタ
  static stVehicle = (props: columnGetterType) => {
    return new Fields([
      { id: 'plateNumber', label: 'プレートNo.', form: { ...defaultRegister }, search: {} },
      {
        id: 'type',
        label: '車種',
        form: { ...defaultRegister },
        type: 'select',
        forSelect: {
          optionsOrOptionFetcher: [
            { id: '大型', name: '大型' },
            { id: '中型', name: '中型' },
            { id: '小型', name: '小型' },
            { id: 'マイクロ', name: 'マイクロ' },
          ],
        },
      },
      { id: 'seats', label: '正席数', form: { ...defaultRegister, defaultValue: 0 }, type: 'number' },
      { id: 'subSeats', label: '補助席数', form: { ...defaultRegister, defaultValue: 0 }, type: 'number' },
      { id: 'phone', label: '車両携帯番号', form: {} },
      { id: 'active', label: '有効', form: { defaultValue: true }, type: 'boolean', td: { hidden: true } },
    ]).transposeColumns()
  }

  // 会社マスタ
  static stCustomer = (props: columnGetterType) => {
    return new Fields([
      { id: 'name', label: '会社名', form: { ...defaultRegister }, search: {} },
      { id: 'active', label: '有効', form: { defaultValue: true }, type: 'boolean', td: { hidden: true } },
    ]).transposeColumns()
  }

  // 担当者マスタ
  static stContact = (props: columnGetterType) => {
    return new Fields([
      { id: 'stCustomerId', label: '会社', forSelect: {}, form: { ...defaultRegister } },
      { id: 'name', label: '担当者名', form: { ...defaultRegister }, search: {} },
      { id: 'phone', label: '電話番号', form: {} },
      { id: 'active', label: '有効', form: { defaultValue: true }, type: 'boolean', td: { hidden: true } },
    ]).transposeColumns()
  }

  // 祝日マスタ
  static stHoliday = (props: columnGetterType) => {
    return new Fields([
      { id: 'date', label: '日付', form: { ...defaultRegister, defaultValue: getMidnight() }, type: 'date' },
      { id: 'name', label: '祝日名', form: { ...defaultRegister } },
    ]).transposeColumns()
  }

  // 乗務員マスタ
  static stDriver = (props: columnGetterType) => {
    return new Fields([
      { id: 'userId', label: 'ユーザー', forSelect: {}, form: { ...defaultRegister } },
      { id: 'driverNumber', label: '乗務員番号', form: {} },
      { id: 'active', label: '有効', form: { defaultValue: true }, type: 'boolean', td: { hidden: true } },
    ]).transposeColumns()
  }

  // スケジュール
  static stSchedule = (props: columnGetterType) => {
    return new Fields([
      // 基本情報
      ...new Fields([
        { id: 'date', label: '運行日', form: { ...defaultRegister, defaultValue: getMidnight() }, type: 'date' },
        { id: 'stVehicleId', label: '車両', forSelect: {}, form: { ...defaultRegister } },
        { id: 'departureTime', label: '出庫時間', form: { ...defaultRegister }, type: 'time' },
        { id: 'returnTime', label: '帰庫時間', form: { ...defaultRegister }, type: 'time' },
      ]).buildFormGroup({ groupName: '基本情報' }).plain,

      // 顧客情報
      ...new Fields([
        { id: 'stCustomerId', label: '会社', forSelect: {}, form: {} },
        { id: 'stContactId', label: '担当者', forSelect: {}, form: {} },
        { id: 'organizationName', label: '団体名', form: { ...defaultRegister } },
        { id: 'organizationContact', label: '担当者名(手入力)', form: {} },
      ]).buildFormGroup({ groupName: '顧客情報' }).plain,

      // 運行詳細
      ...new Fields([
        { id: 'destination', label: '行き先', form: { ...defaultRegister } },
        { id: 'hasGuide', label: 'ガイド有無', form: { defaultValue: false }, type: 'boolean' },
        { id: 'remarks', label: '備考', form: {}, type: 'textarea' },
      ]).buildFormGroup({ groupName: '運行詳細' }).plain,

      // ファイル
      ...new Fields([
        { id: 'pdfFileName', label: '運行指示書', form: {}, type: 'file' },
      ]).buildFormGroup({ groupName: '添付ファイル' }).plain,
    ]).transposeColumns()
  }

  // 公開範囲設定
  static stPublishSetting = (props: columnGetterType) => {
    return new Fields([
      { id: 'publishEndDate', label: '公開終了日', form: {}, type: 'date' },
    ]).transposeColumns()
  }

  // ユーザー（既存パターン）
  static user = (props: columnGetterType) => {
    return new Fields([
      { id: 'name', label: '名称', form: { ...defaultRegister } },
      { id: 'email', label: 'Email', form: { ...defaultRegister } },
      { id: 'password', label: 'パスワード', type: 'password', form: {} },
    ]).transposeColumns()
  }
}
