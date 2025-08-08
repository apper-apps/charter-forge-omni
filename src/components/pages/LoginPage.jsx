import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { useCurrentUser } from "@/hooks/useAuth"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useCurrentUser()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast.success("Welcome to Charter Forge!")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card variant="glass" className="p-8 shadow-2xl">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl">
                <ApperIcon name="FileText" size={32} className="text-white" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
              Charter Forge
            </h1>
            <p className="text-gray-600">
              Build your Family Business Charter
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              size="lg"
            >
              Sign In
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 p-4 bg-gradient-to-r from-accent-50 to-orange-50 rounded-lg border border-accent-200">
            <h3 className="font-semibold text-accent-800 text-sm mb-2">
              Demo Accounts
            </h3>
            <div className="space-y-2 text-xs text-accent-700">
              <div>
                <strong>Participant:</strong> participant@demo.com / demo123
              </div>
              <div>
                <strong>Admin:</strong> admin@demo.com / admin123
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default LoginPage