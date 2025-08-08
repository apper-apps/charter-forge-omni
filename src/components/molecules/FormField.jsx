import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import Select from "@/components/atoms/Select"

const FormField = ({ 
  type = "text", 
  label, 
  value, 
  onChange, 
  error, 
  required = false,
  placeholder,
  options = [],
  rows,
  ...props 
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  if (type === "textarea") {
    return (
      <Textarea
        label={label}
        value={value}
        onChange={handleChange}
        error={error}
        required={required}
        placeholder={placeholder}
        rows={rows}
        {...props}
      />
    )
  }

  if (type === "select") {
    return (
      <Select
        label={label}
        value={value}
        onChange={handleChange}
        error={error}
        required={required}
        {...props}
      >
        <option value="">Select an option...</option>
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </Select>
    )
  }

  return (
    <Input
      type={type}
      label={label}
      value={value}
      onChange={handleChange}
      error={error}
      required={required}
      placeholder={placeholder}
      {...props}
    />
  )
}

export default FormField