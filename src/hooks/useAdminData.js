import { useState, useEffect } from "react"
import { adminService } from "@/services/api/adminService"

export function useParticipants() {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadParticipants()
  }, [])

  const loadParticipants = async () => {
    setLoading(true)
    setError("")
    try {
      const participantData = await adminService.getAllParticipants()
      setParticipants(participantData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getParticipantDetail = async (participantId) => {
    try {
      return await adminService.getParticipantDetail(participantId)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const addCoachingNote = async (participantId, note) => {
    try {
      await adminService.addCoachingNote(participantId, note)
      // Refresh data to get updated notes
      await loadParticipants()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    participants,
    loading,
    error,
    refresh: loadParticipants,
    getParticipantDetail,
    addCoachingNote
  }
}