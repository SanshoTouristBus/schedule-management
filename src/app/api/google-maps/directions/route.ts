import {NextRequest, NextResponse} from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {origin, destination} = body

    if (!origin || !destination) {
      return NextResponse.json({error: '出発地と目的地が必要です'}, {status: 400})
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      return NextResponse.json({error: 'Google Maps APIキーが設定されていません'}, {status: 500})
    }

    // 住所文字列を直接使用してDirections APIを呼び出し
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=driving&key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK') {
      return NextResponse.json({error: `ルート検索に失敗しました: ${data.status}`}, {status: 400})
    }

    // 必要なデータのみを抽出して返す
    const route = data.routes[0]
    const leg = route.legs[0]

    return NextResponse.json({
      distance: leg.distance,
      duration: leg.duration,
      start_location: leg.start_location,
      end_location: leg.end_location,
      steps: leg.steps.map((step: any) => ({
        distance: step.distance,
        duration: step.duration,
        instructions: step.html_instructions,
        start_location: step.start_location,
        end_location: step.end_location,
      })),
    })
  } catch (error) {
    console.error('Google Maps API エラー:', error)
    return NextResponse.json({error: 'ルート検索中にエラーが発生しました'}, {status: 500})
  }
}
