# Wishlist

Une wishlist avec une stratégie de financement. Pour chaque envie, on dit d'où vient l'argent
(Livret A, compte chèque, paie…) et on voit quand on pourra l'acheter. Toute la saisie est manuelle,
il n'y a aucune connexion bancaire.

Projet réalisé pour le TD AdonisJS (BUT MMI 3).

## Fonctionnalités

- **Envies** : créer, modifier, supprimer. Nom, prix, catégorie, priorité (indicative), lien, image, notes,
  statut (envie, en financement, acheté, abandonné), date cible facultative. Filtre par statut.
  Chaque envie a un **rang** (1 = financée en premier), qu'on change avec les flèches.
- **Comptes** : compte courant, Livret A… Chaque compte a un montant disponible pour les envies.
  Le compte courant a en plus une paie mensuelle, un jour de paie et un **budget envies par mois**.
- **Virements mensuels** : par exemple 200 € du compte courant vers le Livret A chaque mois.
  L'argent viré est **bloqué jusqu'à la paie suivante** : placé en novembre, utilisable en décembre.
- **Allocations** : une envie prélève un montant sur un ou plusieurs comptes. La somme doit couvrir le prix.
- **Projection** : tableau mois par mois de l'argent utilisable et bloqué sur chaque compte, et date d'achat
  de chaque envie. Les envies sont servies par rang, et une envie en attente réserve son argent pour ne pas
  se le faire prendre par une envie moins prioritaire. Si une date cible est fixée, l'appli dit si elle est tenue.
- La création, la modification et la suppression passent par des **modales**, la navigation par une **sidebar** rétractable.
- Les montants sont stockés en **centimes** (entiers) pour éviter les erreurs d'arrondi.

## Technologies

- [AdonisJS 6](https://adonisjs.com) (routes, contrôleurs, validation)
- [Lucid ORM](https://lucid.adonisjs.com) avec SQLite
- [VineJS](https://vinejs.dev) pour la validation (messages en français)
- [Inertia.js](https://inertiajs.com) avec React 19 et rendu côté serveur
- [Tailwind CSS v4](https://tailwindcss.com) et [shadcn/ui](https://ui.shadcn.com) (sidebar, modales)

## Installation

Prérequis : Node.js 22 ou plus récent.

```bash
npm install
cp .env.example .env
node ace generate:key
node ace migration:run
node ace db:seed
npm run dev
```

L'application est disponible sur http://localhost:3333.

Le seeder crée deux comptes (CCHQ avec paie le 1er, Livret A), un virement mensuel de 200 € et trois envies
de démonstration : une financée à la prochaine paie, une qui rate sa date cible, une sans allocation.

> En mode développement, le premier chargement après le démarrage peut s'afficher sans style
> le temps que Vite compile le CSS. Un rechargement règle ça.

## Scripts utiles

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement avec rechargement à chaud |
| `npm run typecheck` | Vérification TypeScript |
| `npm run lint` | ESLint et Prettier |
| `node ace migration:fresh --seed` | Repart d'une base vide avec les données de démo |

## Structure

```
app/
  models/        Wish, FundingSource, Allocation (Lucid)
  controllers/   wishes, funding_sources, allocations, monthly_transfers, projections
  validators/    schémas VineJS
  services/      projection.ts : calcul de la projection (fonction pure), projection_loader.ts : lecture en base
database/
  migrations/    schéma des 3 tables
  seeders/       données de démonstration
inertia/
  pages/         pages React (wishes/index, wishes/show, sources/index, projection/index)
  components/    sidebar, layout, modales (envie, allocation, compte, virement, confirmation), champs
  components/ui/ composants shadcn/ui
start/routes.ts  routes
```

## Modèle de données

- `wishes` : `name`, `price_cents`, `category`, `priority`, `rank`, `url`, `image_url`, `notes`, `status`, `target_date`
- `funding_sources` (les comptes) : `name`, `type`, `notes`, `balance_cents`, `monthly_income_cents`,
  `monthly_budget_cents`, `pay_day`
- `monthly_transfers` : `from_source_id`, `to_source_id`, `amount_cents`
- `allocations` : `wish_id`, `funding_source_id`, `amount_cents`

Supprimer une envie ou un compte supprime aussi ses allocations (`ON DELETE CASCADE`).
SQLite n'applique les clés étrangères que si `PRAGMA foreign_keys = ON`, activé dans `config/database.ts`.

## Comment la projection est calculée

À chaque paie, chaque compte reçoit son budget mensuel, et les virements du mois précédent se débloquent.
Les envies sont parcourues par rang : une envie est achetée dès que ses allocations sont couvertes par
l'argent utilisable. Tout est dans `app/services/projection.ts`, une fonction pure qui ne dépend pas de la base de données.
