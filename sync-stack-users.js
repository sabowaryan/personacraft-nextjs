/**
 * Synchronisation manuelle des utilisateurs Stack Auth vers notre DB
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function syncStackUsers() {
  console.log('🔄 Synchronisation des utilisateurs Stack Auth\n');

  try {
    // 1. Récupérer les utilisateurs existants dans notre DB
    console.log('1. État actuel de notre base de données:');
    const existingUsers = await prisma.user.findMany({
      select: { id: true, email: true, name: true }
    });
    
    console.log(`   Utilisateurs actuels: ${existingUsers.length}`);
    existingUsers.forEach(user => {
      console.log(`   - ${user.id}: ${user.email || 'Pas d\'email'}`);
    });

    // 2. Simuler la récupération des utilisateurs Stack Auth
    // Note: En production, vous utiliseriez l'API Stack Auth
    console.log('\n2. Utilisateurs à synchroniser:');
    console.log('   💡 Comme nous n\'avons pas accès direct à l\'API Stack Auth,');
    console.log('   💡 nous allons créer manuellement l\'utilisateur récent.\n');

    // 3. Demander les informations de l'utilisateur récent
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = (question) => {
      return new Promise((resolve) => {
        rl.question(question, resolve);
      });
    };

    console.log('3. Informations de l\'utilisateur récent:');
    const userId = await askQuestion('   ID utilisateur Stack Auth (format UUID): ');
    const userEmail = await askQuestion('   Email de l\'utilisateur: ');
    const userName = await askQuestion('   Nom de l\'utilisateur (optionnel): ');

    rl.close();

    // 4. Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (existingUser) {
      console.log(`\n   ⚠️  L'utilisateur ${userId} existe déjà dans notre DB`);
      return;
    }

    // 5. Récupérer le plan gratuit et le rôle
    const freePlan = await prisma.plan.findFirst({
      where: { name: 'Gratuit' }
    });

    const freeUserRole = await prisma.role.findUnique({
      where: { name: 'free_user' }
    });

    if (!freePlan || !freeUserRole) {
      console.log('\n   ❌ Plan "Gratuit" ou rôle "free_user" manquant');
      console.log('   💡 Exécutez d\'abord: npx prisma db seed');
      return;
    }

    // 6. Créer l'utilisateur avec transaction
    console.log('\n4. Création de l\'utilisateur...');
    
    await prisma.$transaction(async (tx) => {
      // Créer l'utilisateur
      const newUser = await tx.user.create({
        data: {
          id: userId,
          email: userEmail || null,
          name: userName || 'Utilisateur',
          planId: freePlan.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });

      // Attribuer le rôle
      await tx.userRole.create({
        data: {
          userId: newUser.id,
          roleId: freeUserRole.id,
        }
      });

      // Créer les préférences
      await tx.userPreferences.create({
        data: {
          userId: newUser.id,
          theme: 'light',
          language: 'fr',
          autoSave: true,
          generationsCount: 0,
        }
      });

      console.log('   ✅ Utilisateur créé avec succès !');
      console.log(`   📋 ID: ${newUser.id}`);
      console.log(`   📧 Email: ${newUser.email || 'Non défini'}`);
      console.log(`   👤 Nom: ${newUser.name}`);
      console.log(`   💳 Plan: ${freePlan.name}`);
      console.log(`   🔐 Rôle: ${freeUserRole.name}`);
      console.log(`   ⚙️  Préférences: Créées`);
    });

    // 7. Vérification finale
    console.log('\n5. Vérification finale:');
    const finalUserCount = await prisma.user.count();
    console.log(`   Total utilisateurs: ${finalUserCount}`);

    const syncedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        plan: true,
        roles: {
          include: {
            role: true
          }
        },
        preferences: true
      }
    });

    if (syncedUser) {
      console.log('\n   ✅ Synchronisation réussie !');
      console.log('   💡 L\'utilisateur peut maintenant utiliser l\'application');
      console.log('   💡 Il a accès au plan gratuit et aux fonctionnalités de base');
    }

  } catch (error) {
    console.error('\n❌ Erreur lors de la synchronisation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncStackUsers();