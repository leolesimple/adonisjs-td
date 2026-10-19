// Attributs d'accessibilité d'un champ : lie le message d'erreur à l'input pour les lecteurs d'écran
export const a11y = (id: string, error?: string) => ({
  id,
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? `${id}-error` : undefined,
})
