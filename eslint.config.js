import { configApp } from '@adonisjs/eslint-config'
import { react } from '@adonisjs/eslint-config/react'

export default configApp(
  ...react,
  // Code généré (schéma Lucid) ou fourni tel quel par shadcn/ui : on ne le lint pas
  { ignores: ['database/schema.ts', 'inertia/components/ui/**', 'inertia/hooks/**'] },
  {
    rules: {
      // Le texte est en français : les apostrophes dans le JSX sont normales
      'react/no-unescaped-entities': 'off',
    },
  }
)
