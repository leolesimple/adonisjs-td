import type { ReactNode } from 'react'
import { Label } from '~/components/ui/label'

interface FieldProps {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

export default function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
