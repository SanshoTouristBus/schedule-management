import {getOauthClient} from '@app/api/auth/google/getAuth'
import {doStandardPrisma} from '@cm/lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'

export const getValidToken = async (email: string) => {
  const {result: tokenData} = await doStandardPrisma(`googleAccessToken`, `findUnique`, {
    where: {email},
  })

  if (!tokenData) {
    return {
      success: false,
      result: null,
      message: 'Googleアカウントが認証されていません。',
    }
  }

  const token = JSON.parse(tokenData.tokenJSON)
  const expiryDate = new Date(token.expiry_date)

  // トークンが有効期限切れかどうかを確認する
  const isTokenExpired = async (expiryDate: Date) => {
    const now = new Date()
    // 有効期限の5分前を閾値として設定
    const threshold = new Date(expiryDate.getTime() - 5 * 60 * 1000)
    return now >= threshold
  }

  if (await isTokenExpired(expiryDate)) {
    // トークンを更新する
    const refreshAccessToken = async (refreshToken: string) => {
      const oauth2Client = await getOauthClient()

      oauth2Client.setCredentials({refresh_token: refreshToken})

      try {
        const {credentials} = await oauth2Client.refreshAccessToken()
        return credentials
      } catch (error) {
        console.error('トークンの更新に失敗しました:', error)
        // リフレッシュトークンが無効な場合は、ユーザーに再認証を要求
        if (error.message.includes('invalid_grant')) {
          throw new Error('認証の有効期限が切れました。再度ログインしてください。')
        }
        throw error
      }
    }

    const newCredentials = await refreshAccessToken(token.refresh_token)

    // 新しいトークン情報をDBに保存
    const updatedData = {
      email,
      access_token: newCredentials.access_token ?? '',
      refresh_token: token.refresh_token, // リフレッシュトークンは変更されない
      scope: newCredentials.scope ?? '',
      token_type: newCredentials.token_type ?? '',
      id_token: newCredentials.id_token ?? '',
      expiry_date: new Date(Number(newCredentials.expiry_date)),
      tokenJSON: JSON.stringify(newCredentials),
    }

    await doStandardPrisma(`googleAccessToken`, `upsert`, {
      where: {email},
      create: updatedData,
      update: updatedData,
    })

    return {
      success: true,
      result: newCredentials,
      message: 'トークンが更新されました。',
    }
  }

  return {
    success: true,
    result: token,
    message: 'トークンが有効です。',
  }
}
