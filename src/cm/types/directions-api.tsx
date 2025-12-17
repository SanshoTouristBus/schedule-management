import {addQuerySentence} from 'src/cm/lib/methods/urls'
import {anyObject} from '@cm/types/utility-types'
import {fetchAlt} from '@cm/lib/http/fetch-client'

export type geocoded_waypointsType = {place_id: any; types: any[]; geocoder_status: any}
export type latLon = {latitude: number; longtitude: number}

export type waypoint = {
  geocoderStatus?: anyObject
  type?: string[]
  placeId?: string
  address?: string
} & anyObject
export type geocodingResults = {
  origin: waypoint
  destination: waypoint
  intermediates: waypoint[]
}

export type localizedValues = {
  distance: {text: string}
  duration: {text: string}
  staticDuration: {text: string}
}
export type route = {
  description?: string
  distanceMeters?: number
  duration?: string

  localizedValues?: localizedValues
  polyline?: {
    encodedPolyline?: string
  }
  routeLabels?: string[]
  routeToken?: string
  viewport?: {low?: latLon; high?: latLon}
  warnings?: string[]
  legs?: mainLeg[]
}

export type mainLeg = {
  distanceMeters?: number
  duration?: string
  staticDuration?: number
  startLocation?: {latLng?: latLon}
  endDuration?: number
  endLocation?: {latLng?: latLon}
  localizedValues?: localizedValues
  polyline?: {
    encodedPolyline?: string
  }
  navigationInstruction?: {
    instructions?: string
    maneuver?: string
  }
  travelMode?: string

  legs?: mainLeg[] | undefined
  steps?: mainLeg[]
  intermediates?: waypoint[]
}

export const GOOGLE_API_ENDPOINTS = {
  PLACE: {
    DETAIL: {endpoint: `https://maps.googleapis.com/maps/api/place/details/json`},
  },
  ROUTE: {
    COMPUTE_ROUTE: {endpoint: `https://routes.googleapis.com/directions/v2:computeRoutes`},
  },
}

export const getPlceDetail = async ({place_id, fieldStrArr = [`address_components`, `formatted_address`, `name`]}) => {
  const path =
    GOOGLE_API_ENDPOINTS.PLACE.DETAIL.endpoint +
    addQuerySentence({
      place_id,
      key: process.env.NEXT_PUBLIC_GCP_DIRECTIONS_API_KEY,
      fields: fieldStrArr.join(','),
      language: 'ja',
    })
  const placeDetailRes = await fetchAlt(path, {method: 'GET'})

  return placeDetailRes.result.result
}
