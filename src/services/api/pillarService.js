import pillarData from "@/services/mockData/pillars.json"
import responseData from "@/services/mockData/responses.json"

class PillarService {
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getStorageKey(userId) {
    return `charter_responses_${userId}`
  }

  loadUserResponses(userId) {
    const stored = localStorage.getItem(this.getStorageKey(userId))
    return stored ? JSON.parse(stored) : {}
  }

  saveUserResponses(userId, responses) {
    localStorage.setItem(this.getStorageKey(userId), JSON.stringify(responses))
  }

  async getUserPillars(userId) {
    await this.delay()
    
    try {
      const userResponses = this.loadUserResponses(userId)
      
      return pillarData.pillars.map(pillar => {
        const pillarResponses = userResponses[pillar.Id] || {}
        
        return {
          pillarId: pillar.Id,
          title: pillar.title,
          description: pillar.description,
          questions: pillar.questions,
          responses: pillarResponses,
          lastUpdated: new Date().toISOString(),
          isComplete: this.isPillarComplete(pillar, pillarResponses)
        }
      })
    } catch (error) {
      throw new Error("Failed to load pillar data")
    }
  }

  isPillarComplete(pillar, responses) {
    return pillar.questions.every(question => 
      responses[question.Id] && responses[question.Id].trim().length > 0
    )
  }

  async updateResponse(userId, pillarId, questionId, response) {
    await this.delay(200)
    
    try {
      const userResponses = this.loadUserResponses(userId)
      
      if (!userResponses[pillarId]) {
        userResponses[pillarId] = {}
      }
      
      userResponses[pillarId][questionId] = response
      this.saveUserResponses(userId, userResponses)
      
      return { success: true }
    } catch (error) {
      throw new Error("Failed to save response")
    }
  }

  async getPillarById(pillarId) {
    await this.delay()
    
    const pillar = pillarData.pillars.find(p => p.Id === parseInt(pillarId))
    
    if (!pillar) {
      throw new Error("Pillar not found")
    }

    return pillar
  }
}

export const pillarService = new PillarService()