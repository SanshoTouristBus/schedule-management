'use server'

import {requestResultType} from '@cm/types/types'
import {sleep} from '@cm/lib/methods/common'

type processBatchWithRetryType = (props: {
  soruceList: any[]
  mainProcess: (batch: any[]) => Promise<any>
  options?: {
    batchSize: number
    retries: number
  }
}) => Promise<requestResultType>
export const processBatchWithRetry: processBatchWithRetryType = async ({
  soruceList,
  mainProcess,
  options = {batchSize: 500, retries: 1},
}) => {
  try {
    const {batchSize, retries} = options

    const chunks: any[] = []
    for (let i = 0; i < retries; i++) {
      try {
        for (let i = 0; i < soruceList.length; i += batchSize) {
          const now = new Date()
          console.info(`バッチ処理: ${i + 1}/${soruceList.length}件目`)
          const chunk = soruceList.slice(i, i + batchSize)
          chunks.push(chunk)

          const res = await mainProcess(chunk)
          if (res?.message) {
            console.debug(res.message)
          }

          const time = (new Date().getTime() - now.getTime()) / 1000
          console.info(`${i + 1}/${soruceList.length}件目, 所要時間: ${time}秒`)
          await sleep(30)
        }

        break // 成功したらループを抜ける
      } catch (error) {
        console.error(`バッチ処理に失敗しました。試行: ${i + 1}/${retries}`, error)
        if (i === retries - 1) {
          throw error // リトライの回数を超えたらエラーを投げる
        }
        await new Promise(res => setTimeout(res, 1000)) // リトライ間隔を設定
      }
    }

    return {
      success: true,
      result: chunks,
      message: `${batchSize}件ごとに${chunks.length}回のバッチ処理を実施しました。`,
    } as requestResultType
  } catch (error) {
    const message = `processBatchWithRetryでエラーが発生しました。`
    console.error(error.stack) //////////
    return {
      success: false,
      result: null,
      message: message,
    }
  }
}
