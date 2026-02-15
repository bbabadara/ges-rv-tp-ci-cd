// Script pour tester la connexion à PostgreSQL
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: 'postgres' // On se connecte d'abord à la base par défaut
});

async function testConnection() {
  try {
    console.log('🔌 Tentative de connexion à PostgreSQL...');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DB_PORT || '5432'}`);
    console.log(`   User: ${process.env.DB_USERNAME || 'postgres'}`);
    console.log(`   Password: ${process.env.DB_PASSWORD ? '***' : 'non défini'}`);
    
    await client.connect();
    console.log('✅ Connexion réussie à PostgreSQL!');
    
    // Vérifier si la base de données existe
    const dbName = process.env.DB_NAME || 'rdv_medical';
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );
    
    if (result.rows.length === 0) {
      console.log(`\n⚠️  La base de données "${dbName}" n'existe pas.`);
      console.log(`   Création de la base de données...`);
      
      // Note: On ne peut pas créer une base de données depuis une transaction
      // Il faut se connecter à 'postgres' pour créer une autre base
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Base de données "${dbName}" créée avec succès!`);
    } else {
      console.log(`✅ La base de données "${dbName}" existe déjà.`);
    }
    
    await client.end();
    console.log('\n✅ Test de connexion réussi!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur de connexion:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);
    
    if (error.code === '28P01') {
      console.error('\n💡 Solutions possibles:');
      console.error('   1. Vérifiez que le mot de passe dans .env est correct');
      console.error('   2. Essayez de vous connecter avec psql pour vérifier vos identifiants');
      console.error('   3. Réinitialisez le mot de passe PostgreSQL si nécessaire');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Solutions possibles:');
      console.error('   1. Vérifiez que PostgreSQL est démarré');
      console.error('   2. Vérifiez que le port est correct (par défaut: 5432)');
    }
    
    process.exit(1);
  }
}

testConnection();

