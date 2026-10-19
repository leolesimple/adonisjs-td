# Wishlist

Une wishlist avec une stratégie de financement. Pour chaque envie, on dit d'où vient l'argent
(Livret A, compte chèque, paie…) et on voit quand on pourra l'acheter. Toute la saisie est manuelle,
il n'y a aucune connexion bancaire.

Projet réalisé pour le TD AdonisJS (BUT MMI 3).

## Fonctionnalités

- **Envies** : créer, modifier, supprimer. Nom, prix, catégorie, priorité, lien, image, notes, statut
  (envie, en financement, acheté, abandonné). Filtre par statut sur la liste.
- **Sources de financement** : créer, modifier, supprimer. Une source indique seulement d'où vient l'argent
  (épargne, compte chèque, revenu).
- **Allocations** : sur une envie, on ajoute ou on retire des sources avec un montant ponctuel
  (ou déjà mis de côté), une mensualité, et une date de disponibilité (par exemple la paie de novembre).
- **Deux modes de financement** par envie :
  - **Mensualités** : l'appli calcule la date d'achat estimée.
    `mois restants = reste à financer / somme des mensualités`, arrondi au mois supérieur.
  - **Échéance** : on fixe une date à tenir, l'appli affiche le total réuni et ce qu'il reste à couvrir.
- Les montants sont stockés en **centimes** (entiers) pour éviter les erreurs d'arrondi.

## Technologies

- [AdonisJS 6](https://adonisjs.com) (routes, contrôleurs, validation, tests)
- [Lucid ORM](https://lucid.adonisjs.com) avec SQLite
- [VineJS](https://vinejs.dev) pour la validation (messages en français)
- [Inertia.js](https://inertiajs.com) avec React 19 et rendu côté serveur
- [Bootstrap 6 alpha](https://getbootstrap.com/docs/6.0/) via Sass
- [Japa](https://japa.dev) pour les tests

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

Le seeder crée trois sources (Livret A, CCHQ, paie de novembre) et trois envies de démonstration,
une dans chaque situation (mensualités, échéance, sans financement).

> En mode développement, le premier chargement après le démarrage peut s'afficher sans style
> le temps que Vite compile le Sass. Un rechargement règle ça.

## Scripts utiles

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement avec rechargement à chaud |
| `node ace test` | Lance tous les tests (base SQLite séparée, `tmp/db.test.sqlite3`) |
| `npm run typecheck` | Vérification TypeScript |
| `npm run lint` | ESLint et Prettier |
| `node ace migration:fresh --seed` | Repart d'une base vide avec les données de démo |

## Structure

```
app/
  models/        Wish, FundingSource, Allocation (Lucid)
  controllers/   wishes, funding_sources, allocations
  validators/    schémas VineJS
  services/      funding.ts : calcul du financement d'une envie
database/
  migrations/    schéma des 3 tables
  seeders/       données de démonstration
inertia/
  pages/         pages React (wishes/*, sources/index)
  components/    layout, champ de formulaire
start/routes.ts  routes
tests/           unitaires (calcul, clés étrangères) et fonctionnels (CRUD)
```

## Modèle de données

- `wishes` : `name`, `price_cents`, `category`, `priority`, `url`, `image_url`, `notes`, `status`,
  `funding_mode` (`monthly` ou `deadline`), `target_date`
- `funding_sources` : `name`, `type` (`savings`, `checking`, `income`), `notes`
- `allocations` : `wish_id`, `funding_source_id`, `amount_cents`, `monthly_cents`, `available_on`

Supprimer une envie ou une source supprime aussi ses allocations (`ON DELETE CASCADE`).
SQLite n'applique les clés étrangères que si `PRAGMA foreign_keys = ON`, activé dans `config/database.ts`.
