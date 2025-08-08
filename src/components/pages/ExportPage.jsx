import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { useCurrentUser } from "@/hooks/useAuth"
import { useProfile } from "@/hooks/useAuth"
import { usePillarData } from "@/hooks/usePillars"
import { exportService } from "@/services/api/exportService"

const ExportPage = () => {
  const { currentUser } = useCurrentUser()
  const { profile, loading: profileLoading, loadProfile } = useProfile()
  const { pillars, loading: pillarsLoading, error, calculateCompletion } = usePillarData(currentUser?.Id)
  const [exportingPDF, setExportingPDF] = useState(false)
  const [exportingWord, setExportingWord] = useState(false)

  useEffect(() => {
    if (currentUser?.Id) {
      loadProfile(currentUser.Id)
    }
  }, [currentUser?.Id])

  const overallCompletion = pillars.length > 0 
    ? Math.round(pillars.reduce((sum, pillar) => sum + calculateCompletion(pillar), 0) / pillars.length)
    : 0

  const handleExportPDF = async () => {
    setExportingPDF(true)
    try {
      await exportService.exportToPDF(currentUser.Id)
      toast.success("Charter exported as PDF successfully!")
    } catch (error) {
      toast.error("Failed to export PDF. Please try again.")
    } finally {
      setExportingPDF(false)
    }
  }

  const handleExportWord = async () => {
    setExportingWord(true)
    try {
      await exportService.exportToWord(currentUser.Id)
      toast.success("Charter exported as Word document successfully!")
    } catch (error) {
      toast.error("Failed to export Word document. Please try again.")
    } finally {
      setExportingWord(false)
    }
  }

  if (profileLoading || pillarsLoading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} type="page" />
  }

  const isComplete = overallCompletion === 100

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl">
            <ApperIcon name="FileDown" size={32} className="text-white" />
          </div>
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Export Your Charter
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Download your Family Business Charter in your preferred format
        </p>
      </div>

      {/* Completion Status */}
      <Card variant="gradient" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-1">
              Charter Completion Status
            </h2>
            <p className="text-gray-600">
              {profile?.businessName}
            </p>
          </div>
          <Badge variant={isComplete ? "success" : "warning"} size="lg">
            {isComplete ? "Complete" : "In Progress"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {pillars.map((pillar) => {
            const completion = calculateCompletion(pillar)
            return (
              <div key={pillar.pillarId} className="text-center p-4 bg-white/50 rounded-lg">
                <div className="font-semibold text-2xl mb-1">
                  {completion}%
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {pillar.title}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          className="cursor-pointer"
        >
          <Card variant="glass" className="p-6 text-center hover:border-red-300 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="FileText" size={32} className="text-white" />
            </div>
            <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
              PDF Format
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Professional format ideal for printing, sharing, and archival. Maintains consistent formatting across devices.
            </p>
            <Button
              onClick={handleExportPDF}
              loading={exportingPDF}
              disabled={!isComplete}
              icon="Download"
              className="w-full"
              variant="danger"
            >
              Download PDF
            </Button>
            {!isComplete && (
              <p className="text-xs text-gray-500 mt-2">
                Complete all pillars to enable export
              </p>
            )}
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          className="cursor-pointer"
        >
          <Card variant="glass" className="p-6 text-center hover:border-blue-300 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="FileType" size={32} className="text-white" />
            </div>
            <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
              Word Document
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Editable format perfect for collaboration, revisions, and further customization with your team.
            </p>
            <Button
              onClick={handleExportWord}
              loading={exportingWord}
              disabled={!isComplete}
              icon="Download"
              className="w-full"
              variant="primary"
            >
              Download Word
            </Button>
            {!isComplete && (
              <p className="text-xs text-gray-500 mt-2">
                Complete all pillars to enable export
              </p>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Charter Preview */}
      {isComplete && (
        <Card variant="glass" className="p-8 charter-document">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
              Family Business Charter Preview
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-4" />
            <p className="text-gray-600">
              {profile?.businessName} • {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            {pillars.map((pillar) => (
              <div key={pillar.pillarId} className="border-l-4 border-primary-500 pl-6">
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-3">
                  Pillar {pillar.pillarId}: {pillar.title}
                </h3>
                
                {pillar.questions?.map((question, index) => {
                  const response = pillar.responses?.[question.Id]
                  if (!response || !response.trim()) return null
                  
                  return (
                    <div key={question.Id} className="mb-4">
                      <h4 className="font-medium text-gray-800 text-sm mb-2">
                        {index + 1}. {question.text}
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed pl-4">
                        {response}
                      </p>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Generated by Charter Forge • Family Business Charter Builder
            </p>
          </div>
        </Card>
      )}

      {/* Incomplete Warning */}
      {!isComplete && (
        <Card variant="glass" className="p-6 border-yellow-200 bg-yellow-50/80">
          <div className="flex items-start space-x-3">
            <ApperIcon name="AlertTriangle" size={20} className="text-yellow-600 mt-1" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">
                Charter In Progress
              </h4>
              <p className="text-yellow-700 text-sm leading-relaxed mb-4">
                Your charter is {overallCompletion}% complete. Finish all pillars to unlock export functionality and get your complete Family Business Charter.
              </p>
              <Button
                size="sm"
                variant="warning"
                onClick={() => {
                  const nextPillar = pillars.find(pillar => calculateCompletion(pillar) < 100)
                  if (nextPillar) {
                    window.location.href = `/pillar/${nextPillar.pillarId}`
                  }
                }}
                icon="ArrowRight"
              >
                Continue Building
              </Button>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  )
}

export default ExportPage