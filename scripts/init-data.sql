-- ============================================
-- Script d'initialisation des données de test
-- ============================================
-- 
-- Ce script crée les données nécessaires pour tester l'API
-- Exécutez-le dans votre base de données PostgreSQL
-- 
-- Usage: psql -U postgres -d rdv_medical -f scripts/init-data.sql
-- ============================================

-- Créer des spécialités médicales
INSERT INTO specialite (id, code, nom) VALUES
(gen_random_uuid(), 'GEN', 'Généraliste'),
(gen_random_uuid(), 'CAR', 'Cardiologie'),
(gen_random_uuid(), 'DER', 'Dermatologie'),
(gen_random_uuid(), 'GYN', 'Gynécologie'),
(gen_random_uuid(), 'PED', 'Pédiatrie'),
(gen_random_uuid(), 'ORL', 'Oto-rhino-laryngologie'),
(gen_random_uuid(), 'OPH', 'Ophtalmologie'),
(gen_random_uuid(), 'ORT', 'Orthopédie'),
(gen_random_uuid(), 'NEU', 'Neurologie'),
(gen_random_uuid(), 'PSY', 'Psychiatrie')
ON CONFLICT DO NOTHING;

-- Créer des antécédents médicaux
INSERT INTO antecedent (id, code, nom) VALUES
(gen_random_uuid(), 'HTA', 'Hypertension artérielle'),
(gen_random_uuid(), 'DIAB', 'Diabète'),
(gen_random_uuid(), 'ASTH', 'Asthme'),
(gen_random_uuid(), 'ALLE', 'Allergies'),
(gen_random_uuid(), 'CARD', 'Maladies cardiaques'),
(gen_random_uuid(), 'CANC', 'Antécédents de cancer'),
(gen_random_uuid(), 'THY', 'Troubles thyroïdiens'),
(gen_random_uuid(), 'EPI', 'Épilepsie')
ON CONFLICT DO NOTHING;

-- Afficher les spécialités créées
SELECT 'Spécialités créées:' as info;
SELECT id, code, nom FROM specialite ORDER BY code;

-- Afficher les antécédents créés
SELECT 'Antécédents créés:' as info;
SELECT id, code, nom FROM antecedent ORDER BY code;

