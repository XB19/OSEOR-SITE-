# OSEOR — Site vitrine et tableau de bord

Site de la holding **OSEOR SA** (Lomé, Togo) avec son espace d'administration.

- **`oseor-react/`** — site public (React, Vite, Tailwind, Framer Motion, FR / EN / PT) et tableau de bord `/admin`
- **`oseor-backend/`** — API Spring Boot 3 (Java 17, JWT, PostgreSQL)
- **`docker-compose.yml`** — base de données + API + site, prêts à lancer

## Lancer avec Docker

Prérequis : [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
cp .env.example .env        # puis renseigner DB_PASSWORD et JWT_SECRET
docker compose up -d --build
```

- Site : http://localhost:3000
- Tableau de bord : http://localhost:3000/admin

Au premier démarrage, la base est remplie avec le contenu du site (16 filiales, projets, expertises, statistiques)
et un compte administrateur `admin@oseor.tg` est créé (mot de passe initial : voir `oseor-backend/src/main/resources/data.sql`).
**Changez ce mot de passe dès la première connexion** (Tableau de bord › Paramètres).

| Service | Rôle | Données persistantes |
| --- | --- | --- |
| `db` | PostgreSQL 17 | volume `db-data` |
| `backend` | API Spring Boot (non exposée, joignable via le site) | volume `uploads` (logos, images, PDF envoyés) |
| `frontend` | Nginx : site React + relais `/api` et `/uploads` vers l'API | — |

Commandes utiles : `docker compose logs -f backend` · `docker compose down` (garde les données) · `docker compose down -v` (efface tout).

## Développement local (sans Docker)

1. **API** — Java 17 et PostgreSQL installés :
   ```powershell
   cd oseor-backend
   copy .env.example .env      # renseigner DB_PASSWORD
   powershell -ExecutionPolicy Bypass -File .\run-backend.ps1
   ```
   Le script crée la base `oseor_db`, génère `JWT_SECRET` et démarre l'API (port `SERVER_PORT`, 8080 par défaut).

2. **Site** :
   ```bash
   cd oseor-react
   npm install
   npm run dev
   ```
   Si l'API n'écoute pas sur 8080, indiquer son adresse dans `oseor-react/.env.local` : `BACKEND_URL=http://localhost:8081`.

Sans API, le site public reste complet : il utilise le contenu embarqué dans `oseor-react/src/data`.

## Tableau de bord

Filiales, projets, expertises, statistiques, secteurs, actualités, offres d'emploi, appels d'offres, messages du
formulaire de contact, candidatures, comptes administrateurs. Les images et documents s'envoient directement depuis
l'ordinateur (JPG, PNG, WEBP, GIF, PDF, DOC, DOCX — 10 Mo max). Chaque modification est visible immédiatement sur le site.

---

Designed & Developed by KOMADAN Josué K.M.
