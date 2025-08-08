import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Card from "@/components/atoms/Card"
import Textarea from "@/components/atoms/Textarea"
import ApperIcon from "@/components/ApperIcon"

const QuestionCard = ({ 
  question, 
  value = "", 
  onChange, 
  autoSave = true,
  className = "" 
}) => {
  const [localValue, setLocalValue] = useState(value)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    if (autoSave && localValue !== value && localValue.trim() !== "") {
      const timeoutId = setTimeout(async () => {
        setIsSaving(true)
        try {
          await onChange(localValue)
          setLastSaved(new Date())
        } catch (error) {
          console.error("Auto-save failed:", error)
        } finally {
          setIsSaving(false)
        }
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [localValue, value, onChange, autoSave])

  const handleChange = (e) => {
    setLocalValue(e.target.value)
  }

  const wordCount = localValue.trim().split(/\s+/).filter(word => word.length > 0).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card variant="glass" className="p-6">
        <h3 className="font-display text-lg font-semibold text-gray-900 mb-4 leading-relaxed">
          {question.text}
        </h3>
        
        {question.description && (
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {question.description}
          </p>
        )}

        <Textarea
          value={localValue}
          onChange={handleChange}
          placeholder="Share your thoughts and reflections here..."
          rows={6}
          className="mb-3"
        />

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{wordCount} words</span>
          
          <div className="flex items-center space-x-2">
            {isSaving && (
              <div className="flex items-center text-blue-600">
                <ApperIcon name="Loader2" size={16} className="animate-spin mr-1" />
                <span>Saving...</span>
              </div>
            )}
            
            {!isSaving && lastSaved && (
              <div className="flex items-center text-green-600">
                <ApperIcon name="Check" size={16} className="mr-1" />
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default QuestionCard