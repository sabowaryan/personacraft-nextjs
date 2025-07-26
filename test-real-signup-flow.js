/**
 * Test du flux d'inscription complet avec Stack Auth
 * Ce script simule une inscription réelle et vérifie la synchronisation
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSignupFlow() {
  console.log('🔄 Test du flux d\'inscription complet\n');

  try {
    // 1. Vérifier l'état initial
    console.log('1. État initial de la base de données:');
    const initialUserCount = await prisma.user.count();
    console.log(`   Utilisateurs actuels: ${initialUserCount}`);

    // Lister les utilisateurs existants
    const existingUsers = await prisma.user.findMany({
      select: { id: true, email: true, name: true },
      take: 5
    });
    
    console.log('   Utilisateurs existants:');
    existingUsers.forEach(user => {
      console.log(`   - ${user.id}: ${user.email || 'Pas d\'email'} (${user.name || 'Pas de nom'})`);
    });

    // 2. Instructions pour tester l'inscription
    console.log('\n2. Instructions pour tester l\'inscription:');
    console.log('   a) Ouvrez votre navigateur sur http://localhost:3000');
    console.log('   b) Allez sur la page d\'inscription (/auth/signup)');
    console.log('   c) Créez un nouveau compte avec un email unique');
    console.log('   d) Revenez ici et appuyez sur Entrée pour vérifier');

    // Attendre l'input utilisateur
    console.log('\n   ⏳ Créez votre compte puis appuyez sur Entrée...');
    
    // Simuler l'attente (en production, vous feriez une vraie pause)
    await new Promise(resolve => {
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      rl.question('Appuyez sur Entrée après avoir créé votre compte...', () => {
        rl.close();
        resolve();
      });
    });

    // 3. Vérifier les nouveaux utilisateurs
    console.log('\n3. Vérification après inscription:');
    const finalUserCount = await prisma.user.count();
    console.log(`   Utilisateurs maintenant: ${finalUserCount}`);
    
    if (finalUserCount > initialUserCount) {
      console.log(`   ✅ ${finalUserCount - initialUserCount} nouvel(s) utilisateur(s) créé(s) !`);
      
      // Afficher les nouveaux utilisateurs
      const newUsers = await prisma.user.findMany({
        include: {
          plan: true,
          roles: {
            include: {
              role: true
            }
          },
          preferences: true
        },
        orderBy: { createdAt: 'desc' },
        take: finalUserCount - initialUserCount
      });

      console.log('\n   Détails des nouveaux utilisateurs:');
      newUsers.forEach(user => {
        console.log(`   📋 Utilisateur: ${user.id}`);
        console.log(`      Email: ${user.email || 'Non défini'}`);
        console.log(`      Nom: ${user.name || 'Non défini'}`);
        console.log(`      Plan: ${user.plan?.name || 'Aucun plan'}`);
        console.log(`      Rôles: ${user.roles.map(ur => ur.role.name).join(', ') || 'Aucun rôle'}`);
        console.log(`      Préférences: ${user.preferences ? 'Créées' : 'Non créées'}`);
        console.log(`      Créé le: ${user.createdAt}`);
        console.log('');
      });
    } else {
      console.log('   ❌ Aucun nouvel utilisateur détecté');
      console.log('   💡 Vérifiez que:');
      console.log('      - Le webhook est configuré dans Stack Auth');
      console.log('      - L\'URL du webhook est correcte');
      console.log('      - Le secret webhook est valide');
      console.log('      - Votre serveur Next.js est démarré');
    }

    // 4. Vérifier les logs du webhook
    console.log('\n4. Vérification des logs:');
    console.log('   💡 Consultez les logs de votre serveur Next.js pour voir si le webhook a été appelé');
    console.log('   💡 Recherchez des messages comme "webhook_received" ou "user_created"');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSignupFlow();