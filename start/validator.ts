import vine, { SimpleMessagesProvider } from '@vinejs/vine'

// Messages d'erreur VineJS en français, affichés tels quels dans les formulaires
vine.messagesProvider = new SimpleMessagesProvider(
  {
    required: 'Ce champ est obligatoire.',
    requiredWhen: 'Ce champ est obligatoire.',
    string: 'Ce champ doit être un texte.',
    number: 'Ce champ doit être un nombre.',
    date: 'Ce champ doit être une date valide.',
    url: 'Ce champ doit être une URL valide (https://…).',
    enum: 'Valeur non autorisée.',
    minLength: 'Au moins {{ min }} caractères.',
    maxLength: 'Au plus {{ max }} caractères.',
    max: 'La valeur ne peut pas dépasser {{ max }}.',
  },
  {
    name: 'nom',
    price: 'prix',
    amount: 'montant ponctuel',
    monthly: 'montant mensuel',
    fundingSourceId: 'source',
    targetDate: 'date à tenir',
    fromSourceId: 'compte de départ',
    toSourceId: 'compte cible',
    balance: 'solde',
    monthlyIncome: 'paie mensuelle',
    monthlyBudget: 'budget envies',
    payDay: 'jour de paie',
    direction: 'direction',
  }
)
