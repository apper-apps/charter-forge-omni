import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { useCurrentUser } from "@/hooks/useAuth"

const Header = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, logout } = useCurrentUser()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
      navigate("/login")
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  const getPageTitle = () => {
    const path = location.pathname
    if (path.includes("/pillar/")) {
      const pillarId = path.split("/pillar/")[1]
      const pillarNames = {
        "1": "Reason to Begin",
        "2": "Business Type", 
        "3": "Expectations",
        "4": "Extinction"
      }
      return pillarNames[pillarId] || "Pillar"
    }
    
    const titles = {
      "/dashboard": "Your Family Charter",
      "/onboarding": "Welcome Setup",
      "/export": "Export Charter",
      "/admin": "Admin Dashboard",
      "/admin/participants": "Participants"
    }
    
    return titles[path] || "Charter Forge"
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              className="p-2"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
          </div>

          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
                <ApperIcon name="FileText" size={24} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Charter Forge
                </h1>
              </div>
            </div>
            
            <div className="hidden md:block h-6 w-px bg-gray-300" />
            
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold text-gray-900">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {currentUser?.role}
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <ApperIcon name="ChevronDown" size={16} className="text-gray-500" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                >
                  {currentUser?.role === "admin" && (
                    <button
                      onClick={() => {
                        navigate("/admin")
                        setShowUserMenu(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <ApperIcon name="Settings" size={16} className="mr-3" />
                      Admin Dashboard
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      navigate("/dashboard")
                      setShowUserMenu(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <ApperIcon name="Home" size={16} className="mr-3" />
                    Dashboard
                  </button>
                  
                  <div className="border-t border-gray-100 my-1" />
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <ApperIcon name="LogOut" size={16} className="mr-3" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Backdrop for mobile menu */}
            {showUserMenu && (
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header