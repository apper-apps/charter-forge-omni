import { useState, useEffect } from "react"
import { pillarService } from "@/services/api/pillarService"

export function usePillarData(userId) {
  const [pillars, setPillars] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (userId) {
      loadPillars()
    }
  }, [userId])

  const loadPillars = async () => {
    setLoading(true)
    setError("")
    try {
      const pillarData = await pillarService.getUserPillars(userId)
      setPillars(pillarData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updatePillarResponse = async (pillarId, questionId, response) => {
    try {
      await pillarService.updateResponse(userId, pillarId, questionId, response)
      // Update local state
      setPillars(prev => prev.map(pillar => {
        if (pillar.pillarId === pillarId) {
          return {
            ...pillar,
            responses: {
              ...pillar.responses,
              [questionId]: response
            },
            lastUpdated: new Date().toISOString()
          }
        }
        return pillar
      }))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const calculateCompletion = (pillar) => {
    if (!pillar || !pillar.responses) return 0
    const totalQuestions = 3
    const answeredQuestions = Object.values(pillar.responses).filter(response => 
      response && response.trim().length > 0
    ).length
    return Math.round((answeredQuestions / totalQuestions) * 100)
  }

  return {
    pillars,
    loading,
    error,
    updatePillarResponse,
    calculateCompletion,
    refresh: loadPillars
  }
}