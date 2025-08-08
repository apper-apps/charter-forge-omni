import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  className = "", 
  showLabel = true,
  size = "md",
  variant = "primary" 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600",
    success: "bg-gradient-to-r from-green-500 to-green-600",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    danger: "bg-gradient-to-r from-red-500 to-red-600"
  }
  
  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  }

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className={cn("bg-gray-200 rounded-full overflow-hidden", sizes[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full shadow-sm", variants[variant])}
        />
      </div>
    </div>
  )
}

export default ProgressBar