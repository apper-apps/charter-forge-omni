import { useState } from "react"
import Header from "@/components/organisms/Header"
import Sidebar from "@/components/organisms/Sidebar"
import MobileSidebar from "@/components/organisms/MobileSidebar"

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <Header onMobileMenuToggle={() => setMobileMenuOpen(true)} />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:block w-80 min-h-[calc(100vh-4rem)] sticky top-16" />
        
        {/* Mobile Sidebar */}
        <MobileSidebar 
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        
        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout