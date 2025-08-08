import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No data found",
  description = "There's nothing here yet.",
  actionLabel,
  onAction,
  icon = "FileText",
  className = "",
  type = "default"
}) => {
  if (type === "pillars") {
    return (
      <div className={`flex items-center justify-center min-h-[60vh] ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="FileText" size={32} className="text-primary-600" />
          </div>
          <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
            Start Your Charter Journey
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Complete your profile setup to begin working on your Family Business Charter. Each pillar will guide you through important reflections.
          </p>
          {onAction && (
            <Button onClick={onAction} icon="ArrowRight">
              {actionLabel || "Get Started"}
            </Button>
          )}
        </motion.div>
      </div>
    )
  }

  if (type === "participants") {
    return (
      <div className={`flex items-center justify-center min-h-[40vh] ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Users" size={32} className="text-secondary-600" />
          </div>
          <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
            No Participants Yet
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Participants will appear here once they begin their charter journey. Check back later to see their progress.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card variant="glass" className="p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} size={24} className="text-gray-500" />
        </div>
        <h4 className="font-display text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h4>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Card>
    </motion.div>
  )
}

export default Empty