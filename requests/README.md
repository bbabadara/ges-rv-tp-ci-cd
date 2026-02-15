# Fichiers de test HTTP pour l'API GES-RV

Ce dossier contient des fichiers `.http` pour tester les endpoints de l'API de gestion des rendez-vous médicaux.

## Prérequis

1. **Extension REST Client** (pour VS Code)
   - Installez l'extension "REST Client" depuis le marketplace VS Code
   - Ou utilisez un autre client HTTP compatible avec les fichiers `.http`

2. **Serveur démarré**
   - Assurez-vous que le serveur est en cours d'exécution : `npm run dev`
   - Le serveur doit être accessible sur `http://localhost:3000`

3. **Base de données**
   - PostgreSQL doit être démarré
   - La base de données `rdv_medical` doit exister
   - Vous devez avoir créé au moins une spécialité dans la base de données

## Utilisation

### Avec VS Code REST Client

1. Ouvrez le fichier `api.http` dans VS Code
2. Cliquez sur "Send Request" au-dessus de chaque requête
3. Les réponses s'afficheront dans un nouvel onglet

### Variables à configurer

Dans le fichier `api.http`, vous devez remplacer :

- `{{token}}` : Le token JWT obtenu après connexion
- `{{patientId}}` : L'ID d'un patient (UUID)
- `{{demandeId}}` : L'ID d'une demande de rendez-vous (UUID)
- `{{specialiteId}}` : L'ID d'une spécialité (UUID)

### Workflow recommandé

1. **Créer un compte patient** (endpoint #3)
2. **Se connecter** (endpoint #5) - Copier le token de la réponse
3. **Remplacer `{{token}}`** dans le fichier avec le token obtenu
4. **Créer une spécialité** (si nécessaire) via une requête SQL ou l'interface admin
5. **Créer une demande de rendez-vous** (endpoint #11) - Remplacer `{{specialiteId}}`
6. **Tester les autres endpoints** selon vos besoins

## Endpoints disponibles

### Publics (sans authentification)
- `GET /health` - Vérification de santé
- `GET /` - Page d'accueil
- `POST /api/patients` - Créer un compte
- `POST /api/patients/login` - Se connecter

### Protégés (nécessitent un token JWT)
- `GET /api/patients` - Liste des patients
- `GET /api/patients/:id` - Détails d'un patient
- `GET /api/patients/me` - Profil du patient connecté
- `PUT /api/patients/:id` - Mettre à jour un patient
- `DELETE /api/patients/:id` - Supprimer un patient
- `POST /api/demandes` - Créer une demande de RV
- `GET /api/demandes` - Liste des demandes
- `GET /api/demandes/:id` - Détails d'une demande
- `GET /api/demandes/mine` - Mes demandes
- `GET /api/demandes/mine/filter?statut=...` - Filtrer mes demandes
- `GET /api/demandes/mine/confirmed` - Mes rendez-vous confirmés
- `PUT /api/demandes/:id` - Mettre à jour une demande
- `PUT /api/demandes/:id/cancel` - Annuler une demande
- `DELETE /api/demandes/:id` - Supprimer une demande

## Statuts disponibles

### StatutDemande
- `En attente`
- `Valider`
- `Refuser`

### StatutRV
- `En cours`
- `Terminer`
- `Annuler`

## Notes

- Tous les endpoints protégés nécessitent un header `Authorization: Bearer <token>`
- Les IDs sont des UUIDs générés automatiquement
- Les dates doivent être au format `YYYY-MM-DD`
- Les heures doivent être au format `HH:MM` (24h)

