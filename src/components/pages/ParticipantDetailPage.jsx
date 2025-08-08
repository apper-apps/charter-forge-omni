import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Textarea from "@/components/atoms/Textarea"
import ProgressBar from "@/components/molecules/ProgressBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { useParticipants } from "@/hooks/useAdminData"

const ParticipantDetailPage = () => {
  const { participantId } = useParams()
  const navigate = useNavigate()
  const { getParticipantDetail, addCoachingNote } = useParticipants()
  
  const [participant, setParticipant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newNote, setNewNote] = useState("")
  const [addingNote, setAddingNote] = useState(false)

  useEffect(() => {
    loadParticipantDetail()
  }, [participantId])

  const loadParticipantDetail = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await getParticipantDetail(participantId)
      setParticipant(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error("Please enter a note")
      return
    }

    setAddingNote(true)
    try {
      await addCoachingNote(participantId, newNote.trim())
      setNewNote("")
      toast.success("Coaching note added successfully")
      await loadParticipantDetail() // Refresh to show new note
    } catch (error) {
      toast.error("Failed to add coaching note")
    } finally {
      setAddingNote(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadParticipantDetail} type="page" />
  }

  if (!participant) {
    return <Error message="Participant not found" type="page" />
  }

  const getCompletionStatus = (completion) => {
    if (completion === 100) return { variant: "success", label: "Complete" }
    if (completion > 50) return { variant: "warning", label: "In Progress" }
    if (completion > 0) return { variant: "warning", label: "Started" }
    return { variant: "default", label: "Not Started" }
  }

  const overallStatus = getCompletionStatus(participant.overallCompletion)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin")}
            icon="ArrowLeft"
          >
            Back to Admin
          </Button>
          
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">
              {participant.profile.fullName}
            </h1>
            <p className="text-gray-600">
              {participant.profile.businessName} • {participant.profile.position}
            </p>
          </div>
        </div>
        
        <Badge variant={overallStatus.variant} size="lg">
          {overallStatus.label}
        </Badge>
      </div>

      {/* Participant Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card variant="glass" className="p-6">
          <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
            Profile Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Contact</label>
              <p className="text-gray-900">{participant.profile.email}</p>
              {participant.profile.phone && (
                <p className="text-gray-700 text-sm">{participant.profile.phone}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Business Type</label>
              <p className="text-gray-900">{participant.profile.businessType}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Experience</label>
              <p className="text-gray-900">{participant.profile.yearsInBusiness} years</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Location</label>
              <p className="text-gray-900">{participant.profile.location}</p>
            </div>
            
            {participant.profile.annualRevenue && (
              <div>
                <label className="text-sm font-medium text-gray-500">Revenue</label>
                <p className="text-gray-900">{participant.profile.annualRevenue}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Progress Overview */}
        <Card variant="glass" className="p-6">
          <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
            Progress Overview
          </h3>
          
          <div className="text-center mb-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {participant.overallCompletion}%
            </div>
            <div className="text-sm text-gray-500">Overall Completion</div>
          </div>
          
          <ProgressBar 
            value={participant.overallCompletion} 
            variant="primary" 
            showLabel={false}
            className="mb-4"
          />
          
          <div className="space-y-3">
            {participant.pillars.map((pillar) => (
              <div key={pillar.pillarId} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Pillar {pillar.pillarId}</span>
                <Badge 
                  variant={pillar.completion === 100 ? "success" : pillar.completion > 0 ? "warning" : "default"}
                  size="sm"
                >
                  {pillar.completion}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Last Activity */}
        <Card variant="glass" className="p-6">
          <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
            Activity
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-gray-900">
                {new Date(participant.lastUpdated).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Joined</label>
              <p className="text-gray-900">
                {new Date(participant.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${participant.overallCompletion === 100 ? "bg-green-500" : participant.overallCompletion > 0 ? "bg-yellow-500" : "bg-gray-400"}`} />
                <span className="text-sm text-gray-700">
                  {participant.overallCompletion === 100 ? "Charter Complete" : participant.overallCompletion > 0 ? "Actively Building" : "Getting Started"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Pillar Responses */}
      <Card variant="glass" className="p-6">
        <h3 className="font-display text-lg font-semibold text-gray-900 mb-6">
          Charter Responses
        </h3>
        
        <div className="space-y-8">
          {participant.pillars.map((pillar) => (
            <motion.div
              key={pillar.pillarId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-l-4 border-primary-500 pl-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display text-lg font-semibold text-gray-900">
                  Pillar {pillar.pillarId}: {pillar.title}
                </h4>
                <Badge 
                  variant={pillar.completion === 100 ? "success" : pillar.completion > 0 ? "warning" : "default"}
                >
                  {pillar.completion}% Complete
                </Badge>
              </div>
              
              <div className="space-y-4">
                {pillar.questions?.map((question, index) => {
                  const response = pillar.responses?.[question.Id]
                  
                  return (
                    <div key={question.Id} className="bg-white/50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2">
                        {index + 1}. {question.text}
                      </h5>
                      {response && response.trim() ? (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {response}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-sm italic">
                          No response yet
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Coaching Notes */}
      <Card variant="glass" className="p-6">
        <h3 className="font-display text-lg font-semibold text-gray-900 mb-6">
          Coaching Notes
        </h3>
        
        {/* Add New Note */}
        <div className="mb-6">
          <Textarea
            label="Add Coaching Note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Share insights, feedback, or guidance for this participant..."
            rows={4}
            className="mb-3"
          />
          <Button
            onClick={handleAddNote}
            loading={addingNote}
            disabled={!newNote.trim()}
            icon="Plus"
          >
            Add Note
          </Button>
        </div>

        {/* Existing Notes */}
        {participant.coachingNotes && participant.coachingNotes.length > 0 ? (
          <div className="space-y-4">
            {participant.coachingNotes.map((note, index) => (
              <motion.div
                key={note.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/50 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="MessageCircle" size={16} className="text-primary-600" />
                    <span className="font-medium text-gray-900 text-sm">
                      Coach Note
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {note.note}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ApperIcon name="MessageCircle" size={32} className="text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No coaching notes yet</p>
            <p className="text-gray-400 text-sm">Add your first note above to start tracking guidance</p>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default ParticipantDetailPage