const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Connecté à la base de données !');

    const newPersona = await prisma.persona.create({
      data: {
        name: 'Test Persona',
        description: 'Ceci est une persona de test.',
      },
    });
    console.log('Nouvelle persona créée:', newPersona);

    const personas = await prisma.persona.findMany();
    console.log('Toutes les personas:', personas);

  } catch (e) {
    console.error('Erreur Prisma:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();


