# Wishlist

Une liste d'envies qui montre d'où vient l'argent pour les acheter et quand on pourra le faire.
Tout se saisit à la main, sans connexion bancaire. Projet réalisé pour le TD AdonisJS (BUT MMI 3).

## Installation

Prérequis : Node.js 24 ou plus récent.

```bash
npm install
cp .env.example .env
node ace generate:key
node ace migration:run
node ace db:seed
npm run dev
```

Puis ouvre http://localhost:3333.

## Utilisation

- **Envies** : ajoute une envie avec son prix et sa priorité, puis donne-lui un rang (les flèches
  à gauche de la liste) : 1 est financée en premier.
- **Comptes** : déclare d'où vient l'argent (compte courant, Livret A…) avec son disponible. Pour le compte
  courant, indique la paie, le jour de paie et le budget mensuel consacré aux envies.
- **Virements** : programme un virement mensuel entre deux comptes. L'argent viré est bloqué jusqu'à la paie suivante.
- **Allocations** : sur une envie, indique le compte et le montant prélevé. La somme ne peut pas dépasser le prix.
- **Projection** : tableau mois par mois et date d'achat estimée de chaque envie.

Le seeder (`node ace db:seed`) crée des données de démonstration pour voir tout de suite le résultat.
`node ace migration:fresh --seed` repart d'une base vide avec ces données.
