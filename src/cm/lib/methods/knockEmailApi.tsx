'use server'

import nodemailer from 'nodemailer'
import {isDev, systemEmailTo} from 'src/cm/lib/methods/common'

export type attachment = {
  filename: string
  content: string | Buffer
  encoding?: string
  contentType?: string
}
export const knockEmailApi = async (props: {
  subject: string
  text: string
  to: string[]
  cc?: string[]
  html?: string
  attachments?: attachment[]
  doSentInTest?: boolean
}) => {
  // const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = `システムによる自動送信<no-reply@example.com>`

  const smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    pool: true,
    secure: true, // SSL
    auth: {user, pass, from},
  }

  const transporter = nodemailer.createTransport(smtpConfig)

  let {to, cc} = props
  const {subject, text, attachments = [], doSentInTest, html} = props

  const originalTo = to
  const originCC = cc
  to = isDev ? [...systemEmailTo] : [...to]
  cc = isDev ? [] : [...(cc ?? [])]

  if (isDev || process.env.NEXT_PUBLIC_IS_STAGING) {
    const result = {
      to: originalTo.join(`,`),
      cc: originCC?.join(`,`) ?? undefined,
      subject,
      text,
      attachments,
      html,
    }

    if (doSentInTest) {
      const result = await transporter.sendMail({
        to: process.env.SYSTEM_EMAIL_TO,
        subject,
        text,
        html,
        attachments,
      })
    }

    console.info({text, subject})
    originalTo.forEach(email => {
      console.info({to: email.trim()})
    })
    originCC?.forEach(email => {
      console.info({cc: email.trim()})
    })

    if (process.env.NEXT_PUBLIC_IS_STAGING) {
      console.log(`------------EMAIL IS NOT SENT BECAUSE OF STAGING ENV------------`)
    }

    return {success: true, message: '開発環境メール', result}
  }

  try {
    const result = await transporter.sendMail({
      to,
      cc,
      subject,
      text,
      html,
      attachments,
    })
    console.info(`メールを送信しました`, {result, text, to, cc, subject})
    transporter.close()
    return {
      success: true,
      message: 'メールを送信しました',
      result: {accepted: result.accepted, rejected: result.rejected, messageSize: result.messageSize, envelope: result.envelope},
    }
  } catch (error) {
    transporter.close()
    console.error(error.stack)
    return {
      success: false,
      message: error.message,
      result: error,
    }
  }
}
