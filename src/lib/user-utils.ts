const { prisma } = await import('@/lib/prisma');


/**
 * Ensures that a Stack Auth user exists in our Prisma database
 * This prevents foreign key constraint violations when creating related records
 */
export async function ensureUserExists(stackUser: any): Promise<void> {
    try {
        // Check if user exists in our database
        const existingUser = await prisma.user.findUnique({
            where: { id: stackUser.id },
            select: { id: true }
        })

        if (!existingUser) {
            console.log(`User ${stackUser.id} not found in database, creating...`)
            
            // Get default plan and role
            const [freePlan, freeUserRole] = await Promise.all([
                prisma.plan.findFirst({
                    where: { name: 'Gratuit' },
                    select: { id: true }
                }),
                prisma.role.findUnique({
                    where: { name: 'free_user' },
                    select: { id: true }
                })
            ])

            if (!freePlan || !freeUserRole) {
                throw new Error('Default plan or role not found in database')
            }

            // Create user in transaction
            await prisma.$transaction(async (tx: any) => {
                await tx.user.create({
                    data: {
                        id: stackUser.id,
                        email: stackUser.primaryEmail || `user-${stackUser.id}@temp.com`,
                        name: stackUser.displayName || 'Utilisateur',
                        planId: freePlan.id,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                })

                await tx.userRole.create({
                    data: {
                        userId: stackUser.id,
                        roleId: freeUserRole.id
                    }
                })
            })

            console.log(`User ${stackUser.id} created successfully`)
        }
    } catch (error) {
        console.error('Error ensuring user exists:', error)
        throw error
    }
}

/**
 * Handles foreign key constraint errors gracefully
 */
export function handleForeignKeyError(error: unknown, entityName: string = 'entity') {
    if (error instanceof Error && error.message.includes('_userId_fkey')) {
        return {
            error: `Utilisateur non trouvé. Veuillez vous reconnecter.`,
            status: 400
        }
    }
    
    console.error(`Error with ${entityName}:`, error)
    return {
        error: 'Erreur interne du serveur',
        status: 500
    }
}