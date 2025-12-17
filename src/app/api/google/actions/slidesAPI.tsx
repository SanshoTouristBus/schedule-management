'use server'

import {getAuth, getOauthClient} from '@app/api/auth/google/getAuth'
import {google} from 'googleapis'

// スライドを作成する関数
export const createSlide = async (title: string, token?: {access_token: string; refresh_token?: string}) => {
  try {
    let auth

    // トークンがある場合はOAuth2クライアントを使用、なければサービスアカウントを使用
    if (token && token.access_token) {
      const oauth2Client = await getOauthClient()
      oauth2Client.setCredentials(token)
      auth = oauth2Client
    } else {
      auth = await getAuth()
    }

    const slides = google.slides({version: 'v1', auth})

    // 新しいスライドの作成
    const presentation = await slides.presentations.create({
      requestBody: {
        title: title,
      },
    })

    return {
      success: true,
      presentationId: presentation.data.presentationId,
      presentationUrl: `https://docs.google.com/presentation/d/${presentation.data.presentationId}/edit`,
      data: presentation.data,
    }
  } catch (error) {
    console.error('Error creating slide:', error)
    return {
      success: false,
      error: `スライドの作成に失敗しました: ${error}`,
    }
  }
}

// スライドの内容を更新する関数
export const updateSlide = async (
  presentationId: string,
  requests: any[],
  token?: {access_token: string; refresh_token?: string}
) => {
  try {
    let auth

    // トークンがある場合はOAuth2クライアントを使用、なければサービスアカウントを使用
    if (token && token.access_token) {
      const oauth2Client = await getOauthClient()
      oauth2Client.setCredentials(token)
      auth = oauth2Client
    } else {
      auth = await getAuth()
    }

    const slides = google.slides({version: 'v1', auth})

    // スライドの更新
    const response = await slides.presentations.batchUpdate({
      presentationId: presentationId,
      requestBody: {
        requests: requests,
      },
    })

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Error updating slide:', error)
    return {
      success: false,
      error: `スライドの更新に失敗しました: ${error}`,
    }
  }
}

// スライドの情報を取得する関数
export const getSlideInfo = async (presentationId: string, token?: {access_token: string; refresh_token?: string}) => {
  try {
    let auth

    // トークンがある場合はOAuth2クライアントを使用、なければサービスアカウントを使用
    if (token && token.access_token) {
      const oauth2Client = await getOauthClient()
      oauth2Client.setCredentials(token)
      auth = oauth2Client
    } else {
      auth = await getAuth()
    }

    const slides = google.slides({version: 'v1', auth})

    // スライドの情報を取得
    const presentation = await slides.presentations.get({
      presentationId: presentationId,
    })

    return {
      success: true,
      data: presentation.data,
    }
  } catch (error) {
    console.error('Error getting slide info:', error)
    return {
      success: false,
      error: `スライド情報の取得に失敗しました: ${error}`,
    }
  }
}

// JSONデータからスライドを生成する関数
export const generateSlideFromJSON = async (slideData: any, token?: {access_token: string; refresh_token?: string}) => {
  try {
    // 新しいスライドを作成
    const createResult = await createSlide(slideData.title || 'スライド生成', token)

    if (!createResult.success || !createResult.presentationId) {
      throw new Error(createResult.error || 'スライドの作成に失敗しました')
    }

    const presentationId = createResult.presentationId

    // スライドの更新リクエストを作成
    const requests = buildSlidesRequests(slideData)

    // スライドを更新
    const updateResult = await updateSlide(presentationId, requests, token)

    if (!updateResult.success) {
      throw new Error(updateResult.error || 'スライドの更新に失敗しました')
    }

    return {
      success: true,
      presentationId: presentationId,
      presentationUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`,
      data: updateResult.data,
    }
  } catch (error) {
    console.error('Error generating slide from JSON:', error)
    return {
      success: false,
      error: `JSONからのスライド生成に失敗しました: ${error}`,
    }
  }
}

// スライドの更新リクエストを構築する関数
const buildSlidesRequests = (slideData: any) => {
  const requests: any[] = []

  // スライドのページを作成
  slideData.slides.forEach((slide: any, index: number) => {
    // 最初のスライド以外は新しいスライドを追加
    if (index > 0) {
      requests.push({
        createSlide: {
          objectId: `slide_${index}`,
          slideLayoutReference: {
            predefinedLayout: 'BLANK',
          },
        },
      })
    }

    // スライドの内容を追加
    if (slide.title) {
      requests.push({
        createShape: {
          objectId: `title_${index}`,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: index === 0 ? undefined : `slide_${index}`,
            size: {
              width: {magnitude: 600, unit: 'PT'},
              height: {magnitude: 50, unit: 'PT'},
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 50,
              translateY: 30,
              unit: 'PT',
            },
          },
        },
      })

      requests.push({
        insertText: {
          objectId: `title_${index}`,
          text: slide.title,
        },
      })

      // タイトルのスタイル設定
      requests.push({
        updateTextStyle: {
          objectId: `title_${index}`,
          style: {
            fontSize: {magnitude: 24, unit: 'PT'},
            fontWeight: 'BOLD',
          },
          textRange: {
            type: 'ALL',
          },
          fields: 'fontSize,fontWeight',
        },
      })
    }

    // 本文を追加
    if (slide.content) {
      requests.push({
        createShape: {
          objectId: `content_${index}`,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: index === 0 ? undefined : `slide_${index}`,
            size: {
              width: {magnitude: 600, unit: 'PT'},
              height: {magnitude: 320, unit: 'PT'},
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 50,
              translateY: 100,
              unit: 'PT',
            },
          },
        },
      })

      requests.push({
        insertText: {
          objectId: `content_${index}`,
          text: slide.content,
        },
      })

      // 本文のスタイル設定
      requests.push({
        updateTextStyle: {
          objectId: `content_${index}`,
          style: {
            fontSize: {magnitude: 18, unit: 'PT'},
          },
          textRange: {
            type: 'ALL',
          },
          fields: 'fontSize',
        },
      })
    }

    // 画像を追加
    if (slide.image) {
      requests.push({
        createImage: {
          url: slide.image,
          elementProperties: {
            pageObjectId: index === 0 ? undefined : `slide_${index}`,
            size: {
              width: {magnitude: 300, unit: 'PT'},
              height: {magnitude: 200, unit: 'PT'},
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 350,
              translateY: 150,
              unit: 'PT',
            },
          },
        },
      })
    }
  })

  return requests
}

