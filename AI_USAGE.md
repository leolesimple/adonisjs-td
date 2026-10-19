# Utilisation de l'IA

## Outil
Claude Code (CLI, modèle Claude Sonnet 5.5), dans mon terminal, directement sur le dépôt. Je donnais une consigne, il écrivait ou modifiait le code et lançait les tests, et je validais chaque commit avant le push.

## Ce que l'IA m'a apporté
- De l'aide surtout sur le frontend, faire une interface rapide et claire, d'abord en testant Bootsrap 6, puis en repassant sur Tailwind CSS
- De l'aide sur des controleurs et des fonctions métiers, clairifer et aider sur de la rédaction de code plus propre.
- Une migration de 6 vers 7 rapidement.

## Ce que j'ai décidé moi-même
- Le sujet : une wishlist avec une stratégie de financement, en saisie manuelle.
- Les règles métier : la paie arrive sur le compte courant, un virement mensuel part vers le Livret A et reste bloqué jusqu'à la paie suivante, un budget envies fixe par mois, un rang de priorité sur chaque envie.
- Le passage de Bootstrap à Tailwind pour avoir une sidebar et des modales.
- Les règles de travail : je valide chaque commit, aucun secret dans git, ce rapport n'est commité qu'après ma relecture.

## Difficultés rencontrées
- `@vitejs/plugin-react` exigeait Vite 8 alors que le projet est en Vite 6 : version 4 du plugin.
- Bootstrap 6 est en alpha et ses classes diffèrent de la v5, ce qui m'a fait changer pour Tailwind.
- Au changement de modèle (comptes et virements), ma migration supprimait toutes les allocations à cause de `ON DELETE CASCADE` sous SQLite. Il a fallu désactiver les clés étrangères pendant la migration.
- J'avais par erreur commencé mon projet sur AdonisJS 6, j'ai donc dû reprendre avec la version 7 pour corriger les écarts avec le cours.

## Erreurs de l'IA corrigées
- SQLite n'applique pas les clés étrangères sans `PRAGMA foreign_keys = ON` : le CASCADE ne faisait rien. Corrigé dans la configuration de la base.
- Avec VineJS, `positive()` accepte 0 : un virement de 0 € passait. Remplacé par `min(10)`.
- Contrôleurs : un champ vidé n'était pas remis à null, et une source inexistante donnait une erreur 500 au lieu d'un 404.
- On pouvait allouer plus que le prix d'une envie (200 € sur 129 €). Je l'ai vu en testant l'appli. Corrigé côté serveur et dans la modale.
- Une commande git avait stagé une suppression sans que je l'aie demandé : annulée aussitôt.
