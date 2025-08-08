import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import PillarCard from "@/components/molecules/PillarCard"
import ProgressBar from "@/components/molecules/ProgressBar"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { useCurrentUser } from "@/hooks/useAuth"
import { useProfile } from "@/hooks/useAuth"
import { usePillarData } from "@/hooks/usePillars"

const DashboardPage = () => {
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()
  const { profile, loading: profileLoading, loadProfile } = useProfile()
  const { pillars, loading: pillarsLoading, error, calculateCompletion } = usePillarData(currentUser?.Id)

  useEffect(() => {
    if (currentUser?.Id) {
      loadProfile(currentUser.Id)
    }
  }, [currentUser?.Id])

  const overallCompletion = pillars.length > 0 
    ? Math.round(pillars.reduce((sum, pillar) => sum + calculateCompletion(pillar), 0) / pillars.length)
    : 0

  const completedPillars = pillars.filter(pillar => calculateCompletion(pillar) === 100).length

  if (profileLoading || pillarsLoading) {
    return <Loading type="pillar-grid" />
  }

  if (error) {
    return <Error message={error} />
  }

  if (!profile) {
    return (
      <Empty 
        type="pillars"
        title="Welcome to Charter Forge"
        description="Complete your business profile to begin creating your Family Business Charter."
        actionLabel="Complete Profile Setup"
        onAction={() => navigate("/onboarding")}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.fullName?.split(" ")[0]}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Continue building your Family Business Charter for <span className="font-semibold text-primary-600">{profile?.businessName}</span>
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate("/export")}
            icon="Download"
            disabled={overallCompletion < 100}
          >
            Export Charter
          </Button>
          {overallCompletion < 100 && (
            <Button
              onClick={() => {
                const nextPillar = pillars.find(pillar => calculateCompletion(pillar) < 100)
                if (nextPillar) navigate(`/pillar/${nextPillar.pillarId}`)
              }}
              icon="ArrowRight"
            >
              Continue Journey
            </Button>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <Card variant="gradient" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-1">
              Charter Progress
            </h2>
            <p className="text-gray-600 text-sm">
              {completedPillars} of 4 pillars completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {overallCompletion}%
            </div>
            <div className="text-sm text-gray-500">Overall</div>
          </div>
        </div>
        
        <ProgressBar 
          value={overallCompletion} 
          variant="primary" 
          size="lg" 
          showLabel={false}
        />
        
        {overallCompletion === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200"
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
              <span className="font-medium text-green-800">
                Congratulations! Your charter is complete and ready for export.
              </span>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Pillar Grid */}
      <div>
        <h2 className="font-display text-2xl font-semibold text-gray-900 mb-6">
          Charter Pillars
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.pillarId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PillarCard
                pillar={pillar}
                completion={calculateCompletion(pillar)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Business Summary */}
      <Card variant="glass" className="p-6">
        <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
          Business Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/50 rounded-lg">
            <div className="font-semibold text-gray-900">{profile?.businessType}</div>
            <div className="text-sm text-gray-500">Business Type</div>
          </div>
          
          <div className="text-center p-4 bg-white/50 rounded-lg">
            <div className="font-semibold text-gray-900">{profile?.yearsInBusiness} Years</div>
            <div className="text-sm text-gray-500">In Business</div>
          </div>
          
          <div className="text-center p-4 bg-white/50 rounded-lg">
            <div className="font-semibold text-gray-900">{profile?.position}</div>
            <div className="text-sm text-gray-500">Your Role</div>
          </div>
          
          <div className="text-center p-4 bg-white/50 rounded-lg">
            <div className="font-semibold text-gray-900">{profile?.location}</div>
            <div className="text-sm text-gray-500">Location</div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default DashboardPage