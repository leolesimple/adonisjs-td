import type { ReactNode } from 'react'

interface FieldProps {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

// Un champ de formulaire Bootstrap : label, contrôle et message d'erreur VineJS
export default function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && !error && <small className="text-muted">{hint}</small>}
      {error && (
        <small id={`${id}-error`} className="text-danger" role="alert">
          {error}
        </small>
      )}
    </div>
  )
}
