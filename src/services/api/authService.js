import authData from "@/services/mockData/auth.json"
import participantData from "@/services/mockData/participants.json"

const CURRENT_USER_KEY = "charter_forge_current_user"

class AuthService {
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async login(email, password) {
    await this.delay()
    
    const user = authData.users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    
    if (!user) {
      throw new Error("Invalid email or password")
    }

    const { password: _, ...userWithoutPassword } = user
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))
    
    return userWithoutPassword
  }

  async logout() {
    await this.delay(200)
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  async getCurrentUser() {
    await this.delay(100)
    const userData = localStorage.getItem(CURRENT_USER_KEY)
    
    if (!userData) {
      throw new Error("No authenticated user")
    }

    return JSON.parse(userData)
  }

  async getProfile(userId) {
    await this.delay()
    
    const profile = participantData.profiles.find(p => p.userId === userId.toString())
    
    if (!profile) {
      throw new Error("Profile not found")
    }

    return profile
  }

  async updateProfile(userId, profileData) {
    await this.delay()
    
    // In a real app, this would save to the backend
    // For now, we'll simulate success
    const updatedProfile = {
      userId: userId.toString(),
      ...profileData,
      updatedAt: new Date().toISOString()
    }

    return updatedProfile
  }
}

export const authService = new AuthService()