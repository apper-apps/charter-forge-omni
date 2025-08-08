import { useState, useEffect } from "react"
import { authService } from "@/services/api/authService"

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser()
        setCurrentUser(user)
      } catch (error) {
        console.log("No authenticated user")
      } finally {
        setLoading(false)
      }
    }

    loadCurrentUser()
  }, [])

  const login = async (email, password) => {
    const user = await authService.login(email, password)
    setCurrentUser(user)
    return user
  }

  const logout = async () => {
    await authService.logout()
    setCurrentUser(null)
  }

  return {
    currentUser,
    loading,
    login,
    logout
  }
}

export function useProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadProfile = async (userId) => {
    setLoading(true)
    setError("")
    try {
      const profileData = await authService.getProfile(userId)
      setProfile(profileData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (userId, profileData) => {
    setLoading(true)
    setError("")
    try {
      const updatedProfile = await authService.updateProfile(userId, profileData)
      setProfile(updatedProfile)
      return updatedProfile
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile
  }
}