import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  className = "",
  type = "default"
}) => {
  if (type === "page") {
    return (
      <div className={`flex items-center justify-center min-h-[60vh] ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
          </div>
          <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {message}
          </p>
          {onRetry && (
            <Button onClick={onRetry} icon="RefreshCw">
              Try Again
            </Button>
          )}
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
      <Card variant="glass" className="p-6 border-red-200 bg-red-50/80">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <ApperIcon name="AlertCircle" size={20} className="text-red-600 mt-1" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-red-800 mb-1">
              Error Loading Data
            </h4>
            <p className="text-red-700 text-sm leading-relaxed mb-3">
              {message}
            </p>
            {onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="border-red-300 text-red-700 hover:bg-red-100"
                icon="RefreshCw"
              >
                Retry
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Error