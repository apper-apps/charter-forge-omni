import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const PillarCard = ({ pillar, completion = 0, className = "" }) => {
  const navigate = useNavigate()
  
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

  const handleClick = () => {
    navigate(`/pillar/${pillar.Id}`)
  }

  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (completion / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card 
        variant="glass" 
        className="p-6 cursor-pointer group hover:border-primary-300 transition-all duration-300"
        onClick={handleClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${pillarColors[pillar.Id]} text-white shadow-lg`}>
            <ApperIcon name={pillarIcons[pillar.Id]} size={24} />
          </div>
          <div className="relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#2563eb"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out progress-ring"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700">{completion}%</span>
            </div>
          </div>
        </div>
        
        <h3 className="font-display text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {pillar.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {pillar.description}
        </p>
        
        <div className="flex items-center justify-between">
          <Badge 
            variant={completion === 100 ? "success" : completion > 0 ? "warning" : "default"}
          >
            {completion === 100 ? "Complete" : completion > 0 ? "In Progress" : "Not Started"}
          </Badge>
          
          <ApperIcon 
            name="ArrowRight" 
            size={20} 
            className="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200" 
          />
        </div>
      </Card>
    </motion.div>
  )
}

export default PillarCard