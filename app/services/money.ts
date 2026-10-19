// Les montants sont stockés en centimes entiers pour éviter les erreurs d'arrondi des flottants
export const toCents = (euros: number) => Math.round(euros * 100)
