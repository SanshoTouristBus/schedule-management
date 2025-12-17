// 'use client'

// import {useCallback, useEffect, useRef, useState} from 'react'
// import '@cm/lib/googleMaps'
// import {google} from 'googleapis/build/src/index'

// // Google Maps 関連の型定義
// export type GoogleMapInstance = google.maps.Map
// export type GoogleMapMarker = google.maps.Marker
// export type GoogleMapDirectionsService = google.maps.DirectionsService
// export type GoogleMapDirectionsRenderer = google.maps.DirectionsRenderer

// export interface MapLocation {
//   lat: number
//   lng: number
//   address?: string
//   title?: string
//   description?: string
// }

// export interface MapRoute {
//   origin: MapLocation
//   destination: MapLocation
//   waypoints?: MapLocation[]
//   travelMode?: google.maps.TravelMode
// }

// export interface UseGoogleMapsOptions {
//   apiKey?: string
//   defaultCenter?: MapLocation
//   defaultZoom?: number
//   onMapReady?: (map: GoogleMapInstance) => void
// }

// export const useGoogleMaps = (options: UseGoogleMapsOptions = {}) => {
//   const [isLoaded, setIsLoaded] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [map, setMap] = useState<GoogleMapInstance | null>(null)
//   const mapRef = useRef<HTMLDivElement>(null)
//   const markersRef = useRef<GoogleMapMarker[]>([])
//   const directionsRendererRef = useRef<GoogleMapDirectionsRenderer | null>(null)

//   const {
//     apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
//     defaultCenter = {lat: 35.6762, lng: 139.6503}, // 東京駅
//     defaultZoom = 13,
//     onMapReady,
//   } = options

//   // Google Maps APIを動的に読み込み
//   const loadGoogleMapsAPI = useCallback(async () => {
//     if (window.google?.maps) {
//       setIsLoaded(true)
//       return
//     }

//     if (!apiKey) {
//       setError('Google Maps API キーが設定されていません')
//       return
//     }

//     try {
//       const script = document.createElement('script')
//       script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`
//       script.async = true
//       script.defer = true

//       script.onload = () => {
//         setIsLoaded(true)
//         setError(null)
//       }

//       script.onerror = () => {
//         setError('Google Maps APIの読み込みに失敗しました')
//       }

//       document.head.appendChild(script)
//     } catch (err) {
//       setError('Google Maps APIスクリプトの追加に失敗しました')
//     }
//   }, [apiKey])

//   // 地図を初期化
//   const initializeMap = useCallback(() => {
//     if (!isLoaded || !mapRef.current || map) return

//     try {
//       const mapInstance = new google.maps.Map(mapRef.current, {
//         center: defaultCenter,
//         zoom: defaultZoom,
//         mapTypeControl: true,
//         streetViewControl: true,
//         fullscreenControl: true,
//         zoomControl: true,
//         styles: [
//           {
//             featureType: 'poi',
//             elementType: 'labels',
//             stylers: [{visibility: 'on'}],
//           },
//         ],
//       })

//       setMap(mapInstance)
//       onMapReady?.(mapInstance)
//     } catch (err) {
//       setError('地図の初期化に失敗しました')
//     }
//   }, [isLoaded, defaultCenter, defaultZoom, onMapReady, map])

//   // マーカーを追加
//   const addMarker = useCallback(
//     (location: MapLocation) => {
//       if (!map) return null

//       const marker = new google.maps.Marker({
//         position: {lat: location.lat, lng: location.lng},
//         map,
//         title: location.title,
//         animation: google.maps.Animation.DROP,
//       })

//       if (location.description) {
//         const infoWindow = new google.maps.InfoWindow({
//           content: `
//           <div style="padding: 8px;">
//             <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
//               ${location.title || '場所'}
//             </h3>
//             <p style="margin: 0; font-size: 12px; color: #666;">
//               ${location.description}
//             </p>
//             ${location.address ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #888;">${location.address}</p>` : ''}
//           </div>
//         `,
//         })

//         marker.addListener('click', () => {
//           infoWindow.open(map, marker)
//         })
//       }

//       markersRef.current.push(marker)
//       return marker
//     },
//     [map]
//   )

//   // すべてのマーカーをクリア
//   const clearMarkers = useCallback(() => {
//     markersRef.current.forEach(marker => marker.setMap(null))
//     markersRef.current = []
//   }, [])

//   // ルートを表示
//   const showRoute = useCallback(
//     async (route: MapRoute) => {
//       if (!map) return null

//       try {
//         const directionsService = new google.maps.DirectionsService()

//         // 既存のルートをクリア
//         if (directionsRendererRef.current) {
//           directionsRendererRef.current.setMap(null)
//         }

//         const directionsRenderer = new google.maps.DirectionsRenderer({
//           draggable: false,
//           markerOptions: {
//             animation: google.maps.Animation.DROP,
//           },
//         })
//         directionsRenderer.setMap(map)
//         directionsRendererRef.current = directionsRenderer

//         const waypoints =
//           route.waypoints?.map(point => ({
//             location: {lat: point.lat, lng: point.lng},
//             stopover: true,
//           })) || []

//         const request: google.maps.DirectionsRequest = {
//           origin: {lat: route.origin.lat, lng: route.origin.lng},
//           destination: {lat: route.destination.lat, lng: route.destination.lng},
//           waypoints,
//           travelMode: route.travelMode || google.maps.TravelMode.DRIVING,
//           optimizeWaypoints: true,
//           avoidHighways: false,
//           avoidTolls: false,
//         }

//         const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
//           directionsService.route(request, (response, status) => {
//             if (status === google.maps.DirectionsStatus.OK && response) {
//               resolve(response)
//             } else {
//               reject(new Error(`ルート計算エラー: ${status}`))
//             }
//           })
//         })

//         directionsRenderer.setDirections(result)
//         return result
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'ルート表示に失敗しました')
//         return null
//       }
//     },
//     [map]
//   )

//   // 住所から座標を取得（ジオコーディング）
//   const geocodeAddress = useCallback(
//     async (address: string): Promise<MapLocation | null> => {
//       if (!isLoaded) return null

//       try {
//         const geocoder = new google.maps.Geocoder()

//         const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
//           geocoder.geocode({address, region: 'JP'}, (results, status) => {
//             if (status === google.maps.GeocoderStatus.OK && results) {
//               resolve(results)
//             } else {
//               reject(new Error(`ジオコーディングエラー: ${status}`))
//             }
//           })
//         })

//         if (result.length > 0) {
//           const location = result[0].geometry.location
//           return {
//             lat: location.lat(),
//             lng: location.lng(),
//             address: result[0].formatted_address,
//           }
//         }

//         return null
//       } catch (err) {
//         setError(err instanceof Error ? err.message : '住所の座標変換に失敗しました')
//         return null
//       }
//     },
//     [isLoaded]
//   )

//   // 座標から住所を取得（逆ジオコーディング）
//   const reverseGeocode = useCallback(
//     async (location: MapLocation): Promise<string | null> => {
//       if (!isLoaded) return null

//       try {
//         const geocoder = new google.maps.Geocoder()

//         const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
//           geocoder.geocode(
//             {
//               location: {lat: location.lat, lng: location.lng},
//             },
//             (results, status) => {
//               if (status === google.maps.GeocoderStatus.OK && results) {
//                 resolve(results)
//               } else {
//                 reject(new Error(`逆ジオコーディングエラー: ${status}`))
//               }
//             }
//           )
//         })

//         return result.length > 0 ? result[0].formatted_address : null
//       } catch (err) {
//         setError(err instanceof Error ? err.message : '座標の住所変換に失敗しました')
//         return null
//       }
//     },
//     [isLoaded]
//   )

//   // マップの中心を変更
//   const setMapCenter = useCallback(
//     (location: MapLocation, zoom?: number) => {
//       if (!map) return

//       map.setCenter({lat: location.lat, lng: location.lng})
//       if (zoom !== undefined) {
//         map.setZoom(zoom)
//       }
//     },
//     [map]
//   )

//   // 複数の場所がすべて見えるように表示範囲を調整
//   const fitBounds = useCallback(
//     (locations: MapLocation[]) => {
//       if (!map || locations.length === 0) return

//       const bounds = new google.maps.LatLngBounds()
//       locations.forEach(location => {
//         bounds.extend({lat: location.lat, lng: location.lng})
//       })

//       map.fitBounds(bounds)
//     },
//     [map]
//   )

//   // 初期化処理
//   useEffect(() => {
//     loadGoogleMapsAPI()
//   }, [loadGoogleMapsAPI])

//   useEffect(() => {
//     if (isLoaded) {
//       initializeMap()
//     }
//   }, [isLoaded, initializeMap])

//   return {
//     // 状態
//     isLoaded,
//     error,
//     map,
//     mapRef,

//     // 地図操作
//     addMarker,
//     clearMarkers,
//     showRoute,
//     setMapCenter,
//     fitBounds,

//     // ジオコーディング
//     geocodeAddress,
//     reverseGeocode,

//     // 再初期化
//     reload: loadGoogleMapsAPI,
//   }
// }

// export default useGoogleMaps
