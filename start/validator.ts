/*
|--------------------------------------------------------------------------
| Validator file
|--------------------------------------------------------------------------
|
| The validator file is used for configuring global transforms for VineJS.
| The transform below converts all VineJS date outputs from JavaScript
| Date objects to Luxon DateTime instances, so that validated dates are
| ready to use with Lucid models and other parts of the app that expect
| Luxon DateTime.
|
*/

import { DateTime } from 'luxon'
import vine, { SimpleMessagesProvider, VineDate } from '@vinejs/vine'

declare module '@vinejs/vine/types' {
  interface VineGlobalTransforms {
    date: DateTime
  }
}

VineDate.transform((value) => DateTime.fromJSDate(value))

// Messages d'erreur VineJS en français, affichés tels quels sous les champs des formulaires
vine.messagesProvider = new SimpleMessagesProvider(
  {
    required: 'Ce champ est obligatoire.',
    string: 'Ce champ doit être un texte.',
    number: 'Ce champ doit être un nombre.',
    date: 'Ce champ doit être une date valide.',
    url: 'Ce champ doit être une URL valide (https://…).',
    email: 'Ce champ doit être une adresse e-mail valide.',
    enum: 'Valeur non autorisée.',
    minLength: 'Au moins {{ min }} caractères.',
    maxLength: 'Au plus {{ max }} caractères.',
    min: 'La valeur doit être au moins {{ min }}.',
    max: 'La valeur ne peut pas dépasser {{ max }}.',
    withoutDecimals: 'Ce champ doit être un nombre entier.',
  },
  {
    name: 'nom',
    price: 'prix',
    amount: 'montant',
    fundingSourceId: 'compte',
    targetDate: 'date cible',
    fromSourceId: 'compte de départ',
    toSourceId: 'compte cible',
    balance: 'disponible',
    monthlyIncome: 'paie mensuelle',
    monthlyBudget: 'budget envies',
    payDay: 'jour de paie',
    direction: 'direction',
  }
)
