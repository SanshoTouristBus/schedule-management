'use server'

import {google} from 'googleapis'

import {isDev, systemEmailTo} from '@cm/lib/methods/common'
import {getOauthClient} from '@app/api/auth/google/getAuth'
import {getValidToken} from '@app/api/google/lib/middleware'

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

type gmailSendProps = {
  //
  to: string[]
  subject: string
  text: string
  from?: string
}

const getEncodedMessage = async (props: gmailSendProps) => {
  try {
    const toList = isDev ? [systemEmailTo] : [...props.to]
    // メールアドレスの検証
    const emailList = toList.map(email => email.trim())
    const invalidEmails = emailList.filter(email => !validateEmail(email))

    if (invalidEmails.length > 0) {
      throw new Error(`無効なメールアドレスが含まれています: ${invalidEmails.join(', ')}`)
    }

    // メールの作成
    const utf8Subject = `=?utf-8?B?${Buffer.from(props.subject).toString('base64')}?=`
    const messageParts = [
      `To: ${toList.map(email => email.trim()).join(', ')}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      props.text.replace(/\n/g, '<br>'),
    ]
    const message = messageParts.join('\n')

    const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

    return encodedMessage
  } catch (error) {
    console.error('メール送信エラー:', error)
    return ''
  }
}

const getGmailClient = async (props: gmailSendProps) => {
  const from = props.from ?? process.env.SYSTEM_EMAIL_FROM ?? ''
  const validTokenRes = await getValidToken(from)

  // トークンが取得できない場合はエラーを返す
  if (!validTokenRes.success) {
    console.error(validTokenRes)
    throw new Error('トークンが取得できませんでした。')
  }

  // OAuth2クライアントの設定
  const oauth2Client = await getOauthClient()
  oauth2Client.setCredentials(validTokenRes.result)
  const gmail = google.gmail({version: 'v1', auth: oauth2Client})

  return gmail
}

// メール送信関数
export async function Gmail_Send(props: gmailSendProps) {
  try {
    // Gmail APIの初期化
    const gmail = await getGmailClient(props)

    // メールの作成
    const encodedMessage = await getEncodedMessage(props)

    // メール送信
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    })
    return response.data
  } catch (error) {
    console.error('メール送信エラー:', error.stack)
  }
}

export async function Gmail_CreateDraft(props: gmailSendProps) {
  try {
    // Gmail APIの初期化
    const gmail = await getGmailClient(props)

    // メールの作成
    const encodedMessage = await getEncodedMessage(props)

    // メール送信
    const response = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {raw: encodedMessage},
      },
    })
    return response.data
  } catch (error) {
    console.error('メール送信エラー:', error)
  }
}
