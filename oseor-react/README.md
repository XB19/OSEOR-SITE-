# OSEOR — Site vitrine + tableau de bord (React)

Refonte en React du projet Angular [Projet-OSEOR-Frontend](https://github.com/nayra-16/Projet-OSEOR-Frontend),
branchée sur le backend Spring Boot [Projet-OSEOR-Backend](https://github.com/nayra-16/Projet-OSEOR-Backend)
(cloné dans `../oseor-backend`).

## Démarrer en local

1. **Backend** (Java 17 + PostgreSQL) — dans `oseor-backend` :
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\run-backend.ps1
   ```
   Au premier lancement, renseigner `DB_PASSWORD` dans `oseor-backend/.env`. Le script crée la base
   `oseor_db`, génère la clé JWT et démarre l'API (port `SERVER_PORT`, 8081 ici car 8080 est déjà pris).

2. **Site** — dans `oseor-react` :
   ```bash
   npm install
   npm run dev
   ```
   Le fichier `.env.local` indique à Vite où relayer les appels `/api` (`BACKEND_URL=http://localhost:8081`).

- Site public : http://localhost:5173 (ou le port affiché)
- Tableau de bord : `/admin` — compte initial `admin@oseor.tg` (mot de passe initial dans `oseor-backend/src/main/resources/data.sql`,
  **à changer dès la première connexion** dans Paramètres).

Sans backend, le site public reste complet : il retombe sur le contenu embarqué dans `src/data`.

## Tableau de bord

| Section | Ce qu'on y gère | Où ça apparaît |
| --- | --- | --- |
| Filiales | nom, secteur, description, logo, site | Accueil (Nos participations), pages secteurs |
| Projets | titre, description, image | Accueil (Projets accompagnés) |
| Expertises / Statistiques | textes, icônes, chiffres | Accueil |
| Actualités | articles publiés / brouillons / archivés | Bon Plan › Actualité |
| Offres d'emploi | postes, lieu, contrat, date limite | Carrières › Offres d'emploi |
| Appels d'offres | référence, dossier, date limite | Bon Plan › Appel d'offre |
| Messages | formulaire de contact (lecture, réponse, suppression) | — |
| Candidatures, Utilisateurs, Paramètres | archivage, comptes admin, mot de passe | — |

Les fiches enrichies des filiales (données clés, infrastructures, spécialités…) restent dans `src/data/companies.js`
et sont rattachées automatiquement par nom.

## Structure

- `src/admin/` — tableau de bord (chargé seulement sur `/admin`) ; `resources.jsx` décrit les champs de chaque section
- `src/lib/api.js` — client API + jeton JWT ; `src/lib/siteData.jsx` — données du site (API avec repli embarqué)
- `src/data/` — contenus embarqués ; `src/i18n/` — traductions FR / EN / PT
- `src/sections/`, `src/pages/`, `src/components/` — site public
