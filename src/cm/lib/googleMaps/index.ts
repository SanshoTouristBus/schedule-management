// // Google Maps API の型定義
// declare global {
//   namespace google {
//     namespace maps {
//       // 基本的な型定義
//       interface Map {
//         setCenter(latlng: LatLng | LatLngLiteral): void
//         setZoom(zoom: number): void
//         fitBounds(bounds: LatLngBounds): void
//         getCenter(): LatLng
//         getZoom(): number
//       }

//       interface LatLng {
//         lat(): number
//         lng(): number
//       }

//       interface LatLngLiteral {
//         lat: number
//         lng: number
//       }

//       interface LatLngBounds {
//         extend(point: LatLng | LatLngLiteral): LatLngBounds
//         constructor(): LatLngBounds
//       }

//       interface Marker {
//         setMap(map: Map | null): void
//         setPosition(latlng: LatLng | LatLngLiteral): void
//         setIcon(icon: Icon | string): void
//         addListener(eventName: string, handler: Function): void
//         constructor(options: MarkerOptions): Marker
//       }

//       interface MarkerOptions {
//         position?: LatLng | LatLngLiteral
//         map?: Map
//         title?: string
//         animation?: Animation
//       }

//       interface Icon {
//         url: string
//         scaledSize?: Size
//       }

//       interface Size {
//         constructor(width: number, height: number): Size
//       }

//       interface InfoWindow {
//         open(map: Map, anchor?: Marker): void
//         close(): void
//         setContent(content: string): void
//         constructor(options?: InfoWindowOptions): InfoWindow
//       }

//       interface InfoWindowOptions {
//         content?: string
//       }

//       interface DirectionsService {
//         route(request: DirectionsRequest, callback: (result: DirectionsResult | null, status: DirectionsStatus) => void): void
//         constructor(): DirectionsService
//       }

//       interface DirectionsRenderer {
//         setMap(map: Map | null): void
//         setDirections(directions: DirectionsResult): void
//         constructor(options?: DirectionsRendererOptions): DirectionsRenderer
//       }

//       interface DirectionsRendererOptions {
//         draggable?: boolean
//         markerOptions?: MarkerOptions
//       }

//       interface DirectionsRequest {
//         origin: LatLng | LatLngLiteral | string
//         destination: LatLng | LatLngLiteral | string
//         waypoints?: DirectionsWaypoint[]
//         travelMode: TravelMode
//         optimizeWaypoints?: boolean
//         avoidHighways?: boolean
//         avoidTolls?: boolean
//         region?: string
//         drivingOptions?: DrivingOptions
//       }

//       interface DirectionsWaypoint {
//         location: LatLng | LatLngLiteral | string
//         stopover: boolean
//       }

//       interface DirectionsResult {
//         routes: DirectionsRoute[]
//       }

//       interface DirectionsRoute {
//         legs: DirectionsLeg[]
//         overview_path: LatLng[]
//         overview_polyline: DirectionsPolyline
//         warnings: string[]
//       }

//       interface DirectionsLeg {
//         distance?: Distance
//         duration?: Duration
//         start_address: string
//         end_address: string
//         start_location: LatLng
//         end_location: LatLng
//       }

//       interface Distance {
//         text: string
//         value: number
//       }

//       interface Duration {
//         text: string
//         value: number
//       }

//       interface DirectionsPolyline {
//         points: LatLng[]
//       }

//       interface DrivingOptions {
//         departureTime: Date
//         trafficModel: TrafficModel
//       }

//       interface Geocoder {
//         geocode(request: GeocoderRequest, callback: (results: GeocoderResult[] | null, status: GeocoderStatus) => void): void
//         constructor(): Geocoder
//       }

//       interface GeocoderRequest {
//         address?: string
//         location?: LatLng | LatLngLiteral
//         region?: string
//         language?: string
//       }

//       interface GeocoderResult {
//         address_components: GeocoderAddressComponent[]
//         formatted_address: string
//         geometry: GeocoderGeometry
//         place_id: string
//         types: string[]
//       }

//       interface GeocoderAddressComponent {
//         long_name: string
//         short_name: string
//         types: string[]
//       }

//       interface GeocoderGeometry {
//         location: LatLng
//         bounds?: LatLngBounds
//         viewport: LatLngBounds
//       }

//       interface MapOptions {
//         center: LatLng | LatLngLiteral
//         zoom: number
//         mapTypeControl?: boolean
//         streetViewControl?: boolean
//         fullscreenControl?: boolean
//         zoomControl?: boolean
//         styles?: MapTypeStyle[]
//       }

//       interface MapTypeStyle {
//         featureType?: string
//         elementType?: string
//         stylers?: MapTypeStyler[]
//       }

//       interface MapTypeStyler {
//         visibility?: string
//       }

//       // Enums
//       enum TravelMode {
//         DRIVING = 'DRIVING',
//         WALKING = 'WALKING',
//         BICYCLING = 'BICYCLING',
//         TRANSIT = 'TRANSIT',
//       }

//       enum DirectionsStatus {
//         OK = 'OK',
//         NOT_FOUND = 'NOT_FOUND',
//         ZERO_RESULTS = 'ZERO_RESULTS',
//         MAX_WAYPOINTS_EXCEEDED = 'MAX_WAYPOINTS_EXCEEDED',
//         INVALID_REQUEST = 'INVALID_REQUEST',
//         OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
//         REQUEST_DENIED = 'REQUEST_DENIED',
//         UNKNOWN_ERROR = 'UNKNOWN_ERROR',
//       }

//       enum GeocoderStatus {
//         OK = 'OK',
//         ERROR = 'ERROR',
//         INVALID_REQUEST = 'INVALID_REQUEST',
//         OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
//         REQUEST_DENIED = 'REQUEST_DENIED',
//         UNKNOWN_ERROR = 'UNKNOWN_ERROR',
//         ZERO_RESULTS = 'ZERO_RESULTS',
//       }

//       enum TrafficModel {
//         BEST_GUESS = 'bestguess',
//         OPTIMISTIC = 'optimistic',
//         PESSIMISTIC = 'pessimistic',
//       }

//       enum Animation {
//         BOUNCE = 1,
//         DROP = 2,
//       }

//       // ジオメトリライブラリ
//       namespace geometry {
//         namespace spherical {
//           function computeDistanceBetween(from: LatLng, to: LatLng): number
//         }
//       }

//       // Map constructor
//       var Map: {
//         new (mapDiv: Element | null, opts?: MapOptions): Map
//       }

//       // Marker constructor
//       var Marker: {
//         new (opts?: MarkerOptions): Marker
//       }

//       // InfoWindow constructor
//       var InfoWindow: {
//         new (opts?: InfoWindowOptions): InfoWindow
//       }

//       // DirectionsService constructor
//       var DirectionsService: {
//         new (): DirectionsService
//       }

//       // DirectionsRenderer constructor
//       var DirectionsRenderer: {
//         new (opts?: DirectionsRendererOptions): DirectionsRenderer
//       }

//       // Geocoder constructor
//       var Geocoder: {
//         new (): Geocoder
//       }

//       // LatLngBounds constructor
//       var LatLngBounds: {
//         new (): LatLngBounds
//       }

//       // Size constructor
//       var Size: {
//         new (width: number, height: number): Size
//       }

//       // LatLng constructor
//       var LatLng: {
//         new (lat: number, lng: number): LatLng
//       }
//     }
//   }

//   interface Window {
//     google?: typeof google
//   }
// }

// export {}
