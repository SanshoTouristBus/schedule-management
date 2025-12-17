'use client'

import {useState, useCallback} from 'react'
import {StScheduleWithRelations} from '../(server-actions)/schedule-actions'

export const useCopyMode = () => {
  const [copySource, setCopySource] = useState<StScheduleWithRelations | null>(null)
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set())

  const startCopyMode = useCallback((schedule: StScheduleWithRelations) => {
    setCopySource(schedule)
    setSelectedTargets(new Set())
  }, [])

  const cancelCopyMode = useCallback(() => {
    setCopySource(null)
    setSelectedTargets(new Set())
  }, [])

  const toggleTargetSelection = useCallback(
    (vehicleId: number, dateStr: string) => {
      if (!copySource) return

      const key = `${vehicleId}:${dateStr}`
      setSelectedTargets(prev => {
        const next = new Set(prev)
        if (next.has(key)) {
          next.delete(key)
        } else {
          next.add(key)
        }
        return next
      })
    },
    [copySource]
  )

  const isCopyMode = !!copySource

  return {
    copySource,
    selectedTargets,
    isCopyMode,
    startCopyMode,
    cancelCopyMode,
    toggleTargetSelection,
    selectedTargetsCount: selectedTargets.size,
  }
}

