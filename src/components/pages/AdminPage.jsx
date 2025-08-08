import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Card from "@/components/atoms/Card"
import ParticipantCard from "@/components/molecules/ParticipantCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { useParticipants } from "@/hooks/useAdminData"

const AdminPage = () => {
  const navigate = useNavigate()
  const { participants, loading, error, refresh } = useParticipants()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const getCompletionStatus = (completion) => {
    if (completion === 100) return "complete"
    if (completion > 50) return "in-progress"
    if (completion > 0) return "started"
    return "not-started"
  }

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === "all" || getCompletionStatus(participant.overallCompletion) === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: participants.length,
    complete: participants.filter(p => p.overallCompletion === 100).length,
    inProgress: participants.filter(p => p.overallCompletion > 0 && p.overallCompletion < 100).length,
    notStarted: participants.filter(p => p.overallCompletion === 0).length
  }

  if (loading) {
    return <Loading type="participants" />
  }

  if (error) {
    return <Error message={error} onRetry={refresh} type="page" />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor participant progress and provide guidance
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={refresh}
            icon="RefreshCw"
          >
            Refresh Data
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            icon="FileText"
          >
            My Charter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="glass" className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Users" size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600">Total Participants</div>
        </Card>

        <Card variant="glass" className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="CheckCircle" size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.complete}
          </div>
          <div className="text-sm text-gray-600">Complete</div>
        </Card>

        <Card variant="glass" className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Clock" size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.inProgress}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </Card>

        <Card variant="glass" className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Circle" size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.notStarted}
          </div>
          <div className="text-sm text-gray-600">Not Started</div>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="glass" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-48"
            >
              <option value="all">All Participants</option>
              <option value="complete">Complete</option>
              <option value="in-progress">In Progress</option>
              <option value="started">Started</option>
              <option value="not-started">Not Started</option>
            </Select>
            
            <div className="text-sm text-gray-500">
              {filteredParticipants.length} of {participants.length} shown
            </div>
          </div>
        </div>
      </Card>

      {/* Participants Grid */}
      {filteredParticipants.length === 0 ? (
        <Empty 
          type="participants"
          title={searchTerm || filterStatus !== "all" ? "No matching participants" : "No participants yet"}
          description={searchTerm || filterStatus !== "all" 
            ? "Try adjusting your search or filter criteria"
            : "Participants will appear here once they begin their charter journey"}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParticipants.map((participant, index) => (
            <motion.div
              key={participant.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ParticipantCard participant={participant} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default AdminPage