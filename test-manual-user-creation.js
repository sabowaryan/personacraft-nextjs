const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestUser() {
  console.log('🧪 Testing manual user creation...\n');

  try {
    // Simuler les données d'un nouvel utilisateur Stack Auth
    const testUserData = {
      id: 'test-user-' + Date.now(),
      primary_email: 'test@example.com',
      display_name: 'Test User',
      created_at_millis: Date.now(),
      updated_at_millis: Date.now(),
    };

    console.log('Creating user with data:', testUserData);

    await prisma.$transaction(async (tx) => {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await tx.user.findUnique({
        where: { id: testUserData.id },
      });

      if (existingUser) {
        console.log('❌ User already exists, deleting first...');
        await tx.user.delete({
          where: { id: testUserData.id },
        });
      }

      // Récupérer le plan gratuit
      const freePlan = await tx.plan.findFirst({
        where: { name: 'Gratuit' },
      });

      if (!freePlan) {
        throw new Error('Plan "Gratuit" not found');
      }

      // Récupérer le rôle utilisateur gratuit
      const freeUserRole = await tx.role.findUnique({
        where: { name: 'free_user' },
      });

      if (!freeUserRole) {
        throw new Error('Role "free_user" not found');
      }

      // Créer l'utilisateur
      const newUser = await tx.user.create({
        data: {
          id: testUserData.id,
          email: testUserData.primary_email,
          name: testUserData.display_name,
          planId: freePlan.id,
          createdAt: new Date(testUserData.created_at_millis),
          updatedAt: new Date(testUserData.updated_at_millis),
        },
      });

      console.log('✅ User created:', newUser);

      // Attribuer le rôle
      const userRole = await tx.userRole.create({
        data: {
          userId: newUser.id,
          roleId: freeUserRole.id,
        },
      });

      console.log('✅ Role assigned:', userRole);

      // Créer les préférences utilisateur
      const userPreferences = await tx.userPreferences.create({
        data: {
          userId: newUser.id,
          theme: 'light',
          language: 'fr',
          autoSave: true,
          generationsCount: 0,
        },
      });

      console.log('✅ User preferences created:', userPreferences);
    });

    // Vérifier le résultat final
    const createdUser = await prisma.user.findUnique({
      where: { id: testUserData.id },
      include: {
        plan: true,
        roles: {
          include: {
            role: true,
          },
        },
        preferences: true,
      },
    });

    console.log('\n🎉 Final user data:');
    console.log('User:', {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      plan: createdUser.plan?.name,
      roles: createdUser.roles.map(ur => ur.role.name),
      preferences: createdUser.preferences ? 'Created' : 'Not created',
    });

  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();