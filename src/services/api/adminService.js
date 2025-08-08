import participantData from "@/services/mockData/participants.json"
import { pillarService } from "@/services/api/pillarService"
import { authService } from "@/services/api/authService"

class AdminService {
  async delay(ms = 400) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getCoachingNotesKey() {
    return "charter_coaching_notes"
  }

  loadCoachingNotes() {
    const stored = localStorage.getItem(this.getCoachingNotesKey())
    return stored ? JSON.parse(stored) : []
  }

  saveCoachingNotes(notes) {
    localStorage.setItem(this.getCoachingNotesKey(), JSON.stringify(notes))
  }

  async getAllParticipants() {
    await this.delay()
    
    try {
      const participants = []
      
      for (const profile of participantData.profiles) {
        const userId = profile.userId
        
        // Get user pillars to calculate completion
        const pillars = await pillarService.getUserPillars(userId)
        const completions = pillars.map(pillar => {
          const totalQuestions = pillar.questions?.length || 3
          const answeredQuestions = pillar.responses ? 
            Object.values(pillar.responses).filter(response => 
              response && response.trim().length > 0
            ).length : 0
          return Math.round((answeredQuestions / totalQuestions) * 100)
        })
        
        const overallCompletion = completions.length > 0 
          ? Math.round(completions.reduce((sum, comp) => sum + comp, 0) / completions.length)
          : 0
        
        participants.push({
          Id: profile.userId,
          ...profile,
          overallCompletion,
          pillarCompletions: completions,
          lastUpdated: new Date().toISOString(),
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        })
      }
      
      return participants.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
    } catch (error) {
      throw new Error("Failed to load participants")
    }
  }

  async getParticipantDetail(participantId) {
    await this.delay()
    
    try {
      const profile = participantData.profiles.find(p => p.userId === participantId)
      
      if (!profile) {
        throw new Error("Participant not found")
      }

      // Get user pillars with responses
      const pillars = await pillarService.getUserPillars(participantId)
      const completions = pillars.map(pillar => {
        const totalQuestions = pillar.questions?.length || 3
        const answeredQuestions = pillar.responses ? 
          Object.values(pillar.responses).filter(response => 
            response && response.trim().length > 0
          ).length : 0
        return Math.round((answeredQuestions / totalQuestions) * 100)
      })
      
      const overallCompletion = completions.length > 0 
        ? Math.round(completions.reduce((sum, comp) => sum + comp, 0) / completions.length)
        : 0

      // Add completion percentages to pillars
      const pillarsWithCompletion = pillars.map((pillar, index) => ({
        ...pillar,
        completion: completions[index] || 0
      }))

      // Get coaching notes
      const coachingNotes = this.loadCoachingNotes()
      const participantNotes = coachingNotes.filter(note => note.participantId === participantId)
      
      return {
        profile: {
          ...profile,
          email: profile.email || "participant@example.com"
        },
        pillars: pillarsWithCompletion,
        overallCompletion,
        coachingNotes: participantNotes,
        lastUpdated: new Date().toISOString(),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    } catch (error) {
      throw new Error("Failed to load participant details")
    }
  }

  async addCoachingNote(participantId, noteText) {
    await this.delay(200)
    
    try {
      const notes = this.loadCoachingNotes()
      
      const newNote = {
        Id: Date.now().toString(),
        participantId,
        coachId: "admin",
        note: noteText,
        createdAt: new Date().toISOString()
      }
      
      notes.push(newNote)
      this.saveCoachingNotes(notes)
      
      return newNote
    } catch (error) {
      throw new Error("Failed to add coaching note")
    }
  }
}

export const adminService = new AdminService()