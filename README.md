# 🏥 Plateforme de Gestion des Rendez-vous Médicaux

API RESTful pour la gestion des rendez-vous médicaux avec Node.js, Express et TypeScript.

## 🚀 Fonctionnalités

- ✅ Inscription et authentification des patients
- ✅ Gestion du profil patient et antécédents médicaux
- ✅ Création de demandes de rendez-vous
- ✅ Filtrage des demandes par statut
- ✅ Suivi des rendez-vous confirmés
- ✅ Architecture MVC avec pattern Repository
- ✅ Tests automatisés avec Jest
- ✅ CI/CD avec GitHub Actions

## 📋 Technologies

- **Backend**: Node.js + Express + TypeScript
- **Base de données**: PostgreSQL + TypeORM
- **Authentification**: JWT (JSON Web Tokens)
- **Tests**: Jest + Supertest
- **Linting**: ESLint + TypeScript ESLint
- **CI/CD**: GitHub Actions

## 🏗️ Architecture

### Pattern Repository
Implémentation du pattern Repository pour l'abstraction de la couche de données.

### Architecture MVC
- **Models**: Entités TypeORM (Patient, DemandeRV)
- **Views**: N/A (API REST)
- **Controllers**: Gestion des requêtes HTTP
- **Services**: Logique métier
- **Repositories**: Accès aux données

### Principes SOLID
- **SRP**: Chaque classe a une seule responsabilité
- **OCP**: Ouvert à l'extension, fermé à la modification
- **LSP**: Substitution des objets sans modification du comportement
- **ISP**: Interfaces spécifiques pour chaque besoin
- **DIP**: Dépendance sur des abstractions

## 📁 Structure du Projet
ges-rv/
├── src/
│ ├── config/ # Configuration (base de données)
│ ├── entities/ # Entités TypeORM
│ ├── enums/ # Enums (spécialités, statuts)
│ ├── repositories/ # Pattern Repository
│ ├── services/ # Logique métier
│ ├── controllers/ # Contrôleurs Express
│ ├── routes/ # Routes Express
│ ├── middlewares/ # Middlewares (auth, erreurs)
│ ├── utils/ # Utilitaires (password, JWT)
│ └── app.ts # Application principale
├── tests/ # Tests automatisés
├── .github/workflows/ # CI/CD pipelines
├── dist/ # Code compilé TypeScript
├── .env.example # Exemple de variables d'environnement
├── .eslintrc.json # Configuration ESLint
├── tsconfig.json # Configuration TypeScript
├── package.json # Dépendances npm
└── README.md # Documentation

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 18+
- PostgreSQL 12+
- Git

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/VOTRE_USERNAME/gestion-rdv-medical.git
cd gestion-rdv-medical

# Installer les dépendances
npm install

# Copier le fichier d'exemple d'environnement
cp .env.example .env

# Éditer le fichier .env avec vos informations
nano .env

# Créer la base de données PostgreSQL
createdb rdv_medical

# Démarrer le serveur en développement
npm run dev

# Démarrer en développement (avec rechargement automatique)
npm run dev

# Build le projet
npm run build

# Démarrer en production
npm start

# Exécuter les tests
npm test

# Exécuter les tests avec couverture
npm run test:coverage

# Linter le code
npm run lint

# Corriger automatiquement le code
npm run lint:fix
📡 Endpoints API
Santé
GET /health - Vérifier l'état de l'API
Patients
POST /api/patients - Créer un patient
POST /api/patients/login - Se connecter
GET /api/patients - Obtenir tous les patients (auth requis)
GET /api/patients/:id - Obtenir un patient par ID (auth requis)
GET /api/patients/me - Obtenir le profil du patient connecté (auth requis)
PUT /api/patients/:id - Mettre à jour un patient (auth requis)
DELETE /api/patients/:id - Supprimer un patient (auth requis)
Demandes de Rendez-vous
POST /api/demandes - Créer une demande (auth requis)
GET /api/demandes - Obtenir toutes les demandes (auth requis)
GET /api/demandes/:id - Obtenir une demande par ID (auth requis)
GET /api/demandes/mine - Obtenir mes demandes (auth requis)
GET /api/demandes/mine/filter?statut=EN_ATTENTE - Filtrer mes demandes (auth requis)
PUT /api/demandes/:id - Mettre à jour une demande (auth requis)
PUT /api/demandes/:id/cancel - Annuler une demande (auth requis)
DELETE /api/demandes/:id - Supprimer une demande (auth requis)
🔐 Authentification
L'API utilise JWT pour l'authentification. Ajoutez le token dans l'en-tête de chaque requête :
Authorization: Bearer <votre_token_jwt>
🧪 Tests
Les tests sont écrits avec Jest et Supertest :
# Exécuter tous les tests
npm test

# Exécuter en mode watch
npm run test:watch

# Générer le rapport de couverture
npm run test:coverage
🔄 CI/CD
Continuous Integration (CI)
Le workflow CI s'exécute automatiquement sur :
Push sur les branches main ou develop
Pull requests vers main
Il effectue :
Installation des dépendances
Linting du code
Exécution des tests
Build du projet
Continuous Deployment (CD)
Le workflow CD se déclenche uniquement lors de la création d'un tag Git au format vX.Y.Z.
Procédure de déploiement :
# 1. Assurez-vous que tout fonctionne
npm test
npm run lint
npm run build

# 2. Créez un tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# 3. Push le tag
git push origin v1.0.0

# Le workflow CD se déclenchera automatiquement

