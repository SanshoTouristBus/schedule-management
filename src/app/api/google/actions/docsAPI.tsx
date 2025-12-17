'use server'

import {getAuth} from '@app/api/auth/google/getAuth'
import {docs_v1, google} from 'googleapis'

export const GoogleDocs_batchUpdate = async (props: {docId: string; requests: docs_v1.Schema$Request[]}) => {
  const {docId, requests} = props
  const auth = await getAuth()
  const docs = google.docs({version: 'v1', auth})

  // ドキュメントの内容を取得
  const doc = await docs.documents.get({documentId: docId})

  // 既存の本文を全削除
  const bodyContent = doc.data.body?.content

  let endIndex = 1
  if (bodyContent && bodyContent.length > 0) {
    const last = bodyContent[bodyContent.length - 1]
    if (last.endIndex) {
      endIndex = last.endIndex
    }
  }

  // 全文削除
  // if (endIndex > 1) {
  //   const deleteRes = await docs.documents.batchUpdate({
  //     documentId: docId,
  //     requestBody: {
  //       requests: [
  //         {
  //           deleteContentRange: {
  //             range: {startIndex: 1, endIndex: endIndex - 1},
  //           },
  //         },
  //       ],
  //     },
  //   })
  // }

  const modifiedRequests = requests.map((data, i) => {
    const prevText = requests.slice(0, i).reduce((acc, curr) => {
      if (curr.insertText) {
        return acc + (curr.insertText.text ?? '')
      }
      return acc
    }, '')

    if (data.insertText?.location) {
      data.insertText.location.index = prevText.length + 1
    }

    return data
  })

  const res = await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: {requests: modifiedRequests},
  })

  return {success: true, result: res.data, message: `データを更新しました`}
}
