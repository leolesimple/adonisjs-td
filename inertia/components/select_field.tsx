import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import Field from '~/components/field'
import { a11y } from '~/lib/a11y'

interface SelectFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  error?: string
  hint?: string
  placeholder?: string
}

export default function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
  hint,
  placeholder,
}: SelectFieldProps) {
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger {...a11y(id, error)} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
