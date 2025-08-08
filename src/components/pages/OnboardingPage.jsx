import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { useCurrentUser } from "@/hooks/useAuth"
import { useProfile } from "@/hooks/useAuth"

const OnboardingPage = () => {
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()
  const { updateProfile, loading } = useProfile()
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    businessName: "",
    position: "",
    otherOwners: "",
    businessType: "",
    customBusinessType: "",
    yearsInBusiness: "",
    annualRevenue: "",
    country: "",
    city: ""
  })

  const [errors, setErrors] = useState({})

  const businessTypes = [
    "Manufacturing",
    "Retail/E-commerce", 
    "Professional Services",
    "Technology/Software",
    "Healthcare",
    "Real Estate",
    "Construction",
    "Agriculture",
    "Transportation/Logistics",
    "Hospitality/Tourism",
    "Finance/Insurance",
    "Other"
  ]

  const revenueRanges = [
    "Under $500K",
    "$500K - $1M",
    "$1M - $5M", 
    "$5M - $10M",
    "$10M - $50M",
    "$50M+"
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.businessName.trim()) newErrors.businessName = "Business name is required"
    if (!formData.position.trim()) newErrors.position = "Position is required"
    if (!formData.businessType) newErrors.businessType = "Business type is required"
    if (formData.businessType === "Other" && !formData.customBusinessType.trim()) {
      newErrors.customBusinessType = "Please specify your business type"
    }
    if (!formData.yearsInBusiness) newErrors.yearsInBusiness = "Years in business is required"
    if (!formData.country.trim()) newErrors.country = "Country is required"
    if (!formData.city.trim()) newErrors.city = "City is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const profileData = {
        ...formData,
        businessType: formData.businessType === "Other" 
          ? formData.customBusinessType 
          : formData.businessType,
        location: `${formData.city}, ${formData.country}`
      }
      
      await updateProfile(currentUser.Id, profileData)
      toast.success("Profile setup complete! Welcome to Charter Forge.")
      navigate("/dashboard")
    } catch (error) {
      toast.error("Failed to save profile. Please try again.")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <Card variant="glass" className="p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
              <ApperIcon name="UserPlus" size={24} className="text-white" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">
            Welcome to Charter Forge
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Let's get to know you and your family business to create a personalized charter experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="User" size={20} className="mr-2 text-primary-600" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Full Name"
                value={formData.fullName}
                onChange={(value) => handleInputChange("fullName", value)}
                error={errors.fullName}
                required
                placeholder="Enter your full name"
              />
              
              <FormField
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Building" size={20} className="mr-2 text-primary-600" />
              Business Information
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Family Business Name"
                  value={formData.businessName}
                  onChange={(value) => handleInputChange("businessName", value)}
                  error={errors.businessName}
                  required
                  placeholder="Enter your business name"
                />
                
                <FormField
                  label="Your Position in Business"
                  value={formData.position}
                  onChange={(value) => handleInputChange("position", value)}
                  error={errors.position}
                  required
                  placeholder="e.g., CEO, Owner, Partner"
                />
              </div>
              
              <FormField
                type="textarea"
                label="Names of Other Owners"
                value={formData.otherOwners}
                onChange={(value) => handleInputChange("otherOwners", value)}
                placeholder="List family members or partners who own part of the business"
                rows={3}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  type="select"
                  label="Type of Business"
                  value={formData.businessType}
                  onChange={(value) => handleInputChange("businessType", value)}
                  error={errors.businessType}
                  required
                  options={businessTypes}
                />
                
                {formData.businessType === "Other" && (
                  <FormField
                    label="Specify Business Type"
                    value={formData.customBusinessType}
                    onChange={(value) => handleInputChange("customBusinessType", value)}
                    error={errors.customBusinessType}
                    required
                    placeholder="Describe your business type"
                  />
                )}
                
                <FormField
                  type="number"
                  label="Number of Years in Business"
                  value={formData.yearsInBusiness}
                  onChange={(value) => handleInputChange("yearsInBusiness", value)}
                  error={errors.yearsInBusiness}
                  required
                  min="0"
                  placeholder="Enter number of years"
                />
              </div>
              
              <FormField
                type="select"
                label="Annual Revenue Range"
                value={formData.annualRevenue}
                onChange={(value) => handleInputChange("annualRevenue", value)}
                options={revenueRanges}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="MapPin" size={20} className="mr-2 text-primary-600" />
              Location
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Country"
                value={formData.country}
                onChange={(value) => handleInputChange("country", value)}
                error={errors.country}
                required
                placeholder="Enter your country"
              />
              
              <FormField
                label="City"
                value={formData.city}
                onChange={(value) => handleInputChange("city", value)}
                error={errors.city}
                required
                placeholder="Enter your city"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Skip for Now
            </Button>
            <Button
              type="submit"
              loading={loading}
              icon="ArrowRight"
              size="lg"
            >
              Complete Setup
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  )
}

export default OnboardingPage