const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugUserCreation() {
  console.log('🔍 Debugging user creation process...\n');

  try {
    // 1. Vérifier si les plans existent
    console.log('1. Checking plans in database:');
    const plans = await prisma.plan.findMany({
      select: { id: true, name: true }
    });
    console.log('Plans found:', plans);
    
    const freePlan = await prisma.plan.findFirst({
      where: { name: 'Gratuit' }
    });
    console.log('Free plan found:', freePlan ? 'YES' : 'NO');
    if (freePlan) {
      console.log('Free plan details:', freePlan);
    }

    // 2. Vérifier si les rôles existent
    console.log('\n2. Checking roles in database:');
    const roles = await prisma.role.findMany({
      select: { id: true, name: true }
    });
    console.log('Roles found:', roles);
    
    const freeUserRole = await prisma.role.findUnique({
      where: { name: 'free_user' }
    });
    console.log('Free user role found:', freeUserRole ? 'YES' : 'NO');
    if (freeUserRole) {
      console.log('Free user role details:', freeUserRole);
    }

    // 3. Vérifier les utilisateurs existants
    console.log('\n3. Checking existing users:');
    const users = await prisma.user.findMany({
      include: {
        plan: true,
        roles: {
          include: {
            role: true
          }
        }
      }
    });
    console.log(`Users found: ${users.length}`);
    users.forEach(user => {
      console.log(`- User ${user.id}: ${user.email || 'No email'}, Plan: ${user.plan?.name || 'No plan'}, Roles: ${user.roles.map(ur => ur.role.name).join(', ') || 'No roles'}`);
    });

    // 4. Vérifier les variables d'environnement
    console.log('\n4. Checking environment variables:');
    console.log('STACK_WEBHOOK_SECRET:', process.env.STACK_WEBHOOK_SECRET ? 'SET' : 'NOT SET');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

  } catch (error) {
    console.error('Error during debug:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugUserCreation();