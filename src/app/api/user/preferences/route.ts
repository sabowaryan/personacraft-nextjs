import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        // Vérifier l'authentification
        const user = await stackServerApp.getUser()
        if (!user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            )
        }

        const { preferences, action } = await request.json()

        // Gérer l'action d'incrémentation des générations
        if (action === 'increment_generations') {
            const userPreferences = await prisma.userPreferences.upsert({
                where: {
                    userId: user.id
                },
                update: {
                    generationsCount: {
                        increment: 1
                    },
                    updatedAt: new Date()
                },
                create: {
                    userId: user.id,
                    theme: 'light',
                    language: 'fr',
                    autoSave: true,
                    generationsCount: 1
                }
            })

            return NextResponse.json({
                success: true,
                generationsCount: userPreferences.generationsCount
            })
        }

        if (!preferences) {
            return NextResponse.json(
                { error: 'Préférences manquantes' },
                { status: 400 }
            )
        }

        // Sauvegarder les préférences dans la base de données
        const userPreferences = await prisma.userPreferences.upsert({
            where: {
                userId: user.id
            },
            update: {
                theme: preferences.theme || 'light',
                language: preferences.language || 'fr',
                autoSave: preferences.autoSave || true,
                updatedAt: new Date()
            },
            create: {
                userId: user.id,
                theme: preferences.theme || 'light',
                language: preferences.language || 'fr',
                autoSave: preferences.autoSave || true
            }
        })

        return NextResponse.json({
            success: true,
            preferences: userPreferences
        })

    } catch (error) {
        console.error('Erreur lors de la sauvegarde des préférences:', error)
        return NextResponse.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        // Vérifier l'authentification
        const user = await stackServerApp.getUser()
        if (!user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            )
        }

        // Récupérer les préférences de l'utilisateur
        const userPreferences = await prisma.userPreferences.findUnique({
            where: {
                userId: user.id
            }
        })

        if (!userPreferences) {
            // Retourner les préférences par défaut
            return NextResponse.json({
                preferences: {
                    theme: 'light',
                    language: 'fr',
                    autoSave: true
                }
            })
        }

        return NextResponse.json({
            preferences: {
                theme: userPreferences.theme,
                language: userPreferences.language,
                autoSave: userPreferences.autoSave
            }
        })

    } catch (error) {
        console.error('Erreur lors de la récupération des préférences:', error)
        return NextResponse.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
        )
    }
}