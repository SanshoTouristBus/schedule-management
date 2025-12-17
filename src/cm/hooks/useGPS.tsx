'use client'

import {useState} from 'react'
type location = {
  lat: number | null
  lng: number | null
}
type error = string | null

const useGPS = () => {
  const [location, setLocation] = useState<location>({lat: null, lng: null})
  const [error, setError] = useState<error>(null)

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setError(null)
      },
      err => {
        setError(`Error: ${err.message}`)
      }
    )
  }

  return {
    location,
    error,
    getLocation,
  }
}

export default useGPS
