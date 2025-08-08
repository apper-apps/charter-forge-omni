import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import Layout from "@/components/organisms/Layout"
import LoginPage from "@/components/pages/LoginPage"
import DashboardPage from "@/components/pages/DashboardPage"
import OnboardingPage from "@/components/pages/OnboardingPage"
import PillarPage from "@/components/pages/PillarPage"
import ExportPage from "@/components/pages/ExportPage"
import AdminPage from "@/components/pages/AdminPage"
import ParticipantDetailPage from "@/components/pages/ParticipantDetailPage"
import { useCurrentUser } from "@/hooks/useAuth"

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <Router>
        <AppRoutes />
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-50"
      />
    </div>
  )
}

function AppRoutes() {
  const { currentUser, loading } = useCurrentUser()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  console.log('Current user:', currentUser)

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/pillar/:pillarId" element={<PillarPage />} />
          <Route path="/export" element={<ExportPage />} />
          {currentUser.role === "admin" && (
            <>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/participant/:participantId" element={<ParticipantDetailPage />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

export default App