// 'use client'

// import {MapLocation} from '@cm/hooks/useGoogleMaps'
// import './index'

// export interface AddressComponents {
//   postalCode?: string
//   prefecture?: string
//   city?: string
//   street?: string
//   building?: string
//   fullAddress: string
// }

// export interface GeocodingResult extends MapLocation {
//   addressComponents: AddressComponents
//   placeId?: string
//   types?: string[]
// }

// export interface GeocodingServiceOptions {
//   region?: string
//   language?: string
//   enableHighAccuracy?: boolean
// }

// class GeocodingService {
//   private readonly defaultOptions: GeocodingServiceOptions = {
//     region: 'JP',
//     language: 'ja',
//     enableHighAccuracy: true,
//   }

//   constructor(private options: GeocodingServiceOptions = {}) {
//     this.options = {...this.defaultOptions, ...options}
//   }

//   // 住所から座標を取得（フォワードジオコーディング）
//   async geocode(address: string): Promise<GeocodingResult[]> {
//     if (!window.google?.maps) {
//       throw new Error('Google Maps API が読み込まれていません')
//     }

//     const geocoder = new google.maps.Geocoder()

//     try {
//       const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
//         geocoder.geocode(
//           {
//             address,
//             region: this.options.region,
//             language: this.options.language,
//           },
//           (results, status) => {
//             if (status === google.maps.GeocoderStatus.OK && results) {
//               resolve(results)
//             } else {
//               reject(new Error(`Geocoding failed: ${status}`))
//             }
//           }
//         )
//       })

//       return results.map(result => this.formatGeocodingResult(result))
//     } catch (error) {
//       throw new Error(error instanceof Error ? error.message : 'ジオコーディングに失敗しました')
//     }
//   }

//   // 座標から住所を取得（リバースジオコーディング）
//   async reverseGeocode(lat: number, lng: number): Promise<GeocodingResult[]> {
//     if (!window.google?.maps) {
//       throw new Error('Google Maps API が読み込まれていません')
//     }

//     const geocoder = new google.maps.Geocoder()

//     try {
//       const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
//         geocoder.geocode(
//           {
//             location: {lat, lng},
//             language: this.options.language,
//           },
//           (results, status) => {
//             if (status === google.maps.GeocoderStatus.OK && results) {
//               resolve(results)
//             } else {
//               reject(new Error(`Reverse geocoding failed: ${status}`))
//             }
//           }
//         )
//       })

//       return results.map(result => this.formatGeocodingResult(result))
//     } catch (error) {
//       throw new Error(error instanceof Error ? error.message : 'リバースジオコーディングに失敗しました')
//     }
//   }

//   // SBMアプリの住所形式から座標を取得
//   async geocodeFromSBMAddress(addressData: {
//     postalCode?: string
//     prefecture?: string
//     city?: string
//     street?: string
//     building?: string
//   }): Promise<GeocodingResult | null> {
//     // 住所文字列を構築
//     const addressParts = [addressData.prefecture, addressData.city, addressData.street, addressData.building].filter(
//       part => part && part.trim()
//     )

//     if (addressParts.length === 0) {
//       throw new Error('住所情報が不足しています')
//     }

//     const fullAddress = addressParts.join('')

//     try {
//       const results = await this.geocode(fullAddress)

//       if (results.length === 0) {
//         // 郵便番号での検索を試行
//         if (addressData.postalCode) {
//           const postalResults = await this.geocode(`〒${addressData.postalCode}`)
//           return postalResults.length > 0 ? postalResults[0] : null
//         }
//         return null
//       }

//       return results[0]
//     } catch (error) {
//       console.warn('住所からの座標取得に失敗:', error)
//       return null
//     }
//   }

//   // 複数の住所を一括でジオコーディング（レート制限を考慮）
//   async batchGeocode(addresses: string[], delayMs = 200): Promise<Array<GeocodingResult | null>> {
//     const results: Array<GeocodingResult | null> = []

//     for (let i = 0; i < addresses.length; i++) {
//       try {
//         const geocodingResults = await this.geocode(addresses[i])
//         results.push(geocodingResults.length > 0 ? geocodingResults[0] : null)

//         // レート制限を避けるための遅延
//         if (i < addresses.length - 1) {
//           await new Promise(resolve => setTimeout(resolve, delayMs))
//         }
//       } catch (error) {
//         console.warn(`住所のジオコーディングに失敗: ${addresses[i]}`, error)
//         results.push(null)
//       }
//     }

//     return results
//   }

//   // 住所の類似度を計算（配達効率化用）
//   calculateAddressSimilarity(address1: AddressComponents, address2: AddressComponents): number {
//     let score = 0
//     let totalWeight = 0

//     // 都道府県の比較（重み: 1）
//     if (address1.prefecture && address2.prefecture) {
//       totalWeight += 1
//       if (address1.prefecture === address2.prefecture) score += 1
//     }

//     // 市区町村の比較（重み: 2）
//     if (address1.city && address2.city) {
//       totalWeight += 2
//       if (address1.city === address2.city) score += 2
//     }

//     // 町名・番地の比較（重み: 1）
//     if (address1.street && address2.street) {
//       totalWeight += 1
//       if (address1.street.includes(address2.street) || address2.street.includes(address1.street)) {
//         score += 0.5
//       }
//       if (address1.street === address2.street) score += 0.5
//     }

//     return totalWeight > 0 ? score / totalWeight : 0
//   }

//   // Googleジオコーディング結果をフォーマット
//   private formatGeocodingResult(result: google.maps.GeocoderResult): GeocodingResult {
//     const location = result.geometry.location
//     const addressComponents = this.parseAddressComponents(result.address_components)

//     return {
//       lat: location.lat(),
//       lng: location.lng(),
//       address: result.formatted_address,
//       addressComponents,
//       placeId: result.place_id,
//       types: result.types,
//     }
//   }

//   // Google Maps の address_components を日本の住所形式に変換
//   private parseAddressComponents(components: google.maps.GeocoderAddressComponent[]): AddressComponents {
//     const parsed: Partial<AddressComponents> = {}

//     components.forEach(component => {
//       const types = component.types

//       if (types.includes('postal_code')) {
//         parsed.postalCode = component.long_name
//       } else if (types.includes('administrative_area_level_1')) {
//         parsed.prefecture = component.long_name
//       } else if (types.includes('locality') || types.includes('administrative_area_level_2')) {
//         parsed.city = component.long_name
//       } else if (types.includes('sublocality_level_1') || types.includes('sublocality_level_2')) {
//         if (!parsed.street) {
//           parsed.street = component.long_name
//         } else {
//           parsed.street += component.long_name
//         }
//       } else if (types.includes('premise') || types.includes('subpremise')) {
//         parsed.building = (parsed.building || '') + component.long_name
//       }
//     })

//     // 完全な住所を構築
//     const fullAddressParts = [parsed.prefecture, parsed.city, parsed.street, parsed.building].filter(part => part && part.trim())

//     return {
//       postalCode: parsed.postalCode,
//       prefecture: parsed.prefecture,
//       city: parsed.city,
//       street: parsed.street,
//       building: parsed.building,
//       fullAddress: fullAddressParts.join(''),
//     }
//   }

//   // 座標間の距離を計算（km）
//   calculateDistance(point1: {lat: number; lng: number}, point2: {lat: number; lng: number}): number {
//     if (!window.google?.maps) {
//       // Haversine formula をフォールバックとして使用
//       const R = 6371 // 地球の半径（km）
//       const dLat = this.toRadians(point2.lat - point1.lat)
//       const dLon = this.toRadians(point2.lng - point1.lng)
//       const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
//       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
//       return R * c
//     }

//     // Google Maps Geometry Library を使用
//     const lat1 = new google.maps.LatLng(point1.lat, point1.lng)
//     const lat2 = new google.maps.LatLng(point2.lat, point2.lng)
//     return google.maps.geometry.spherical.computeDistanceBetween(lat1, lat2) / 1000 // mからkmに変換
//   }

//   private toRadians(degrees: number): number {
//     return degrees * (Math.PI / 180)
//   }
// }

// // シングルトンインスタンス
// export const geocodingService = new GeocodingService()

// export default GeocodingService
