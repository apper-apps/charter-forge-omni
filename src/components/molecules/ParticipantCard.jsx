import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ProgressBar from "@/components/molecules/ProgressBar"
import ApperIcon from "@/components/ApperIcon"

const ParticipantCard = ({ participant, className = "" }) => {
  const navigate = useNavigate()
  
  const handleViewDetail = () => {
    navigate(`/admin/participant/${participant.Id}`)
  }

  const getCompletionStatus = (completion) => {
    if (completion === 100) return { variant: "success", label: "Complete" }
    if (completion > 50) return { variant: "warning", label: "In Progress" }
    if (completion > 0) return { variant: "warning", label: "Started" }
    return { variant: "default", label: "Not Started" }
  }

  const status = getCompletionStatus(participant.overallCompletion)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className={className}
    >
      <Card variant="glass" className="p-6 cursor-pointer group hover:border-primary-300 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-gray-900 mb-1">
              {participant.fullName}
            </h3>
            <p className="text-primary-600 font-medium text-sm">
              {participant.businessName}
            </p>
            <p className="text-gray-500 text-sm">
              {participant.position}
            </p>
          </div>
          
          <Badge variant={status.variant}>
            {status.label}
          </Badge>
        </div>

        <div className="mb-4">
          <ProgressBar 
            value={participant.overallCompletion} 
            variant="primary"
            size="sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Business Type:</span>
            <p className="font-medium text-gray-900">{participant.businessType}</p>
          </div>
          <div>
            <span className="text-gray-500">Years in Business:</span>
            <p className="font-medium text-gray-900">{participant.yearsInBusiness} years</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Last updated: {new Date(participant.lastUpdated).toLocaleDateString()}
          </div>
          
          <button
            onClick={handleViewDetail}
            className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm group-hover:translate-x-1 transition-all duration-200"
          >
            View Details
            <ApperIcon name="ArrowRight" size={16} className="ml-1" />
          </button>
        </div>
      </Card>
    </motion.div>
  )
}

export default ParticipantCard