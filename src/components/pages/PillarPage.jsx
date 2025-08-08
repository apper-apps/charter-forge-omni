import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import QuestionCard from "@/components/molecules/QuestionCard"
import ProgressBar from "@/components/molecules/ProgressBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { useCurrentUser } from "@/hooks/useAuth"
import { usePillarData } from "@/hooks/usePillars"
import { pillarService } from "@/services/api/pillarService"

const PillarPage = () => {
  const { pillarId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()
  const { pillars, loading, error, updatePillarResponse, calculateCompletion } = usePillarData(currentUser?.Id)

  const currentPillar = pillars.find(p => p.pillarId.toString() === pillarId)
  const pillarIndex = parseInt(pillarId) - 1
  const completion = currentPillar ? calculateCompletion(currentPillar) : 0

  useEffect(() => {
    if (!loading && !currentPillar && pillars.length > 0) {
      navigate("/dashboard")
      toast.error("Pillar not found")
    }
  }, [currentPillar, loading, pillars, navigate])

  const handleResponseUpdate = async (questionId, response) => {
    try {
      await updatePillarResponse(parseInt(pillarId), questionId, response)
      toast.success("Response saved", { autoClose: 1500 })
    } catch (error) {
      toast.error("Failed to save response")
      throw error
    }
  }

  const handleNext = () => {
    const nextPillarId = parseInt(pillarId) + 1
    if (nextPillarId <= 4) {
      navigate(`/pillar/${nextPillarId}`)
    } else {
      navigate("/export")
    }
  }

  const handlePrevious = () => {
    const prevPillarId = parseInt(pillarId) - 1
    if (prevPillarId >= 1) {
      navigate(`/pillar/${prevPillarId}`)
    } else {
      navigate("/dashboard")
    }
  }

  if (loading) {
    return <Loading type="questions" />
  }

  if (error) {
    return <Error message={error} type="page" />
  }

  if (!currentPillar) {
    return <Loading type="questions" />
  }

  const pillarIcons = {
    1: "Heart",
    2: "Target", 
    3: "Users",
    4: "AlertTriangle"
  }

  const pillarColors = {
    1: "from-red-500 to-pink-600",
    2: "from-blue-500 to-indigo-600",
    3: "from-green-500 to-emerald-600", 
    4: "from-orange-500 to-red-600"
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Pillar Header */}
      <Card variant="gradient" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${pillarColors[parseInt(pillarId)]} text-white shadow-lg`}>
              <ApperIcon name={pillarIcons[parseInt(pillarId)]} size={24} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">
                Pillar {pillarId}: {currentPillar.title}
              </h1>
              <p className="text-gray-600 mt-1">
                {currentPillar.description}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {completion}%
            </div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>
        
        <ProgressBar 
          value={completion} 
          variant="primary" 
          showLabel={false}
        />
      </Card>

      {/* Navigation Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <button
          onClick={() => navigate("/dashboard")}
          className="hover:text-primary-600 transition-colors duration-200"
        >
          Dashboard
        </button>
        <ApperIcon name="ChevronRight" size={16} />
        <span className="text-gray-900 font-medium">
          Pillar {pillarId}
        </span>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {currentPillar.questions?.map((question, index) => (
          <motion.div
            key={question.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <QuestionCard
              question={question}
              value={currentPillar.responses?.[question.Id] || ""}
              onChange={(value) => handleResponseUpdate(question.Id, value)}
            />
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <Card variant="glass" className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex space-x-3">
            {parseInt(pillarId) > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                icon="ArrowLeft"
                iconPosition="left"
              >
                Previous Pillar
              </Button>
            )}
            
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              icon="Home"
            >
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              Pillar {pillarId} of 4
            </span>
            
            <Button
              onClick={handleNext}
              icon={parseInt(pillarId) === 4 ? "FileDown" : "ArrowRight"}
              iconPosition="right"
            >
              {parseInt(pillarId) === 4 ? "Review & Export" : "Next Pillar"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default PillarPage