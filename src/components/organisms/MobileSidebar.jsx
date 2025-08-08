import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { useCurrentUser } from "@/hooks/useAuth"
import { cn } from "@/utils/cn"

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useCurrentUser()

  const participantNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: "Home" },
    { path: "/pillar/1", label: "Reason to Begin", icon: "Heart" },
    { path: "/pillar/2", label: "Business Type", icon: "Target" },
    { path: "/pillar/3", label: "Expectations", icon: "Users" },
    { path: "/pillar/4", label: "Extinction", icon: "AlertTriangle" },
    { path: "/export", label: "Export Charter", icon: "Download" }
  ]

  const adminNavItems = [
    { path: "/admin", label: "Admin Dashboard", icon: "BarChart3" },
    { path: "/dashboard", label: "My Charter", icon: "FileText" }
  ]

  const navItems = currentUser?.role === "admin" ? adminNavItems : participantNavItems

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard"
    }
    return location.pathname.startsWith(path)
  }

  const handleNavigation = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-md border-r border-gray-200 z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
                    <ApperIcon name="FileText" size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                      Charter Forge
                    </h2>
                    <p className="text-xs text-gray-500">Family Business Charter</p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <ApperIcon name="X" size={20} className="text-gray-500" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.path}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                      isActive(item.path)
                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                    )}
                  >
                    <ApperIcon 
                      name={item.icon} 
                      size={20} 
                      className={isActive(item.path) ? "text-white" : "text-gray-500"} 
                    />
                    <span className="font-medium">{item.label}</span>
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="mobileActiveTab"
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </nav>

              {currentUser?.role === "participant" && (
                <div className="mt-8 p-4 bg-gradient-to-r from-accent-50 to-orange-50 rounded-lg border border-accent-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Lightbulb" size={16} className="text-accent-600" />
                    <h3 className="font-semibold text-accent-800 text-sm">
                      Charter Tip
                    </h3>
                  </div>
                  <p className="text-accent-700 text-xs leading-relaxed">
                    Take your time with each pillar. Thoughtful reflection leads to a stronger family business charter.
                  </p>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileSidebar