'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Persona {
  id: string
  name: string
  age: number
  occupation: string
  location: string
  demographics: {
    income: string
    education: string
    familyStatus: string
  }
  psychographics: {
    personality: string[]
    values: string[]
    interests: string[]
    lifestyle: string
  }
  culturalData: {
    music: string[]
    movies: string[]
    brands: string[]
    socialMedia: string[]
  }
  painPoints: string[]
  goals: string[]
  marketingInsights: {
    preferredChannels: string[]
    messagingTone: string
    buyingBehavior: string
  }
  qualityScore: number
  createdAt: string
}

export default function DashboardPage() {
  const [brief, setBrief] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [personas, setPersonas] = useState<Persona[]>([])
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [sessionData, setSessionData] = useState<any>(null)

  // Charger les données de session au montage
  useEffect(() => {
    const savedPersonas = localStorage.getItem('personacraft_personas')
    const savedSession = localStorage.getItem('personacraft_session')
    
    if (savedPersonas) {
      setPersonas(JSON.parse(savedPersonas))
    }
    
    if (savedSession) {
      setSessionData(JSON.parse(savedSession))
    } else {
      // Créer une nouvelle session
      const newSession = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        totalPersonas: 0
      }
      setSessionData(newSession)
      localStorage.setItem('personacraft_session', JSON.stringify(newSession))
    }
  }, [])

  // Sauvegarder les personas dans localStorage
  const savePersonas = (newPersonas: Persona[]) => {
    setPersonas(newPersonas)
    localStorage.setItem('personacraft_personas', JSON.stringify(newPersonas))
    
    // Mettre à jour les stats de session
    if (sessionData) {
      const updatedSession = {
        ...sessionData,
        totalPersonas: newPersonas.length,
        lastUpdated: new Date().toISOString()
      }
      setSessionData(updatedSession)
      localStorage.setItem('personacraft_session', JSON.stringify(updatedSession))
    }
  }

  // Simuler la génération de personas (remplacera l'appel API réel)
  const generatePersonas = async () => {
    if (!brief.trim()) return

    setIsGenerating(true)
    
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Génération de personas simulées basées sur le brief
    const mockPersonas: Persona[] = [
      {
        id: Date.now().toString() + '_1',
        name: 'Marie Dubois',
        age: 32,
        occupation: 'Chef de projet marketing',
        location: 'Paris, France',
        demographics: {
          income: '45 000 - 60 000€/an',
          education: 'Master en Marketing',
          familyStatus: 'En couple, sans enfants'
        },
        psychographics: {
          personality: ['Ambitieuse', 'Créative', 'Analytique', 'Sociable'],
          values: ['Innovation', 'Qualité', 'Efficacité', 'Authenticité'],
          interests: ['Design', 'Technologie', 'Voyage', 'Cuisine'],
          lifestyle: 'Urbain actif, soucieux de l\'équilibre vie pro/perso'
        },
        culturalData: {
          music: ['Indie Pop', 'Electronic', 'Jazz moderne'],
          movies: ['Films d\'auteur', 'Documentaires', 'Comédies françaises'],
          brands: ['Apple', 'Zara', 'Sephora', 'Airbnb'],
          socialMedia: ['Instagram', 'LinkedIn', 'Pinterest']
        },
        painPoints: [
          'Manque de temps pour la veille concurrentielle',
          'Difficulté à mesurer le ROI des campagnes créatives',
          'Pression pour des résultats rapides'
        ],
        goals: [
          'Développer des campagnes innovantes',
          'Améliorer l\'engagement client',
          'Évoluer vers un poste de direction'
        ],
        marketingInsights: {
          preferredChannels: ['Social Media', 'Email', 'Content Marketing'],
          messagingTone: 'Professionnel mais accessible',
          buyingBehavior: 'Recherche approfondie avant achat'
        },
        qualityScore: 92,
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now().toString() + '_2',
        name: 'Thomas Martin',
        age: 28,
        occupation: 'Développeur Full-Stack',
        location: 'Lyon, France',
        demographics: {
          income: '40 000 - 50 000€/an',
          education: 'École d\'ingénieur',
          familyStatus: 'Célibataire'
        },
        psychographics: {
          personality: ['Logique', 'Curieux', 'Perfectionniste', 'Introverti'],
          values: ['Performance', 'Open Source', 'Apprentissage continu'],
          interests: ['Gaming', 'IA', 'Blockchain', 'Fitness'],
          lifestyle: 'Digital native, early adopter'
        },
        culturalData: {
          music: ['Lo-fi Hip Hop', 'Synthwave', 'Ambient'],
          movies: ['Sci-fi', 'Thrillers technologiques', 'Anime'],
          brands: ['GitHub', 'Tesla', 'Nike', 'Spotify'],
          socialMedia: ['Twitter', 'Reddit', 'Discord', 'YouTube']
        },
        painPoints: [
          'Veille technologique chronophage',
          'Difficulté à expliquer les concepts techniques',
          'Syndrome de l\'imposteur'
        ],
        goals: [
          'Maîtriser les nouvelles technologies',
          'Contribuer à des projets open source',
          'Lancer sa propre startup'
        ],
        marketingInsights: {
          preferredChannels: ['Developer Communities', 'Tech Blogs', 'YouTube'],
          messagingTone: 'Technique et factuel',
          buyingBehavior: 'Comparaison détaillée des specs'
        },
        qualityScore: 88,
        createdAt: new Date().toISOString()
      }
    ]

    const updatedPersonas = [...personas, ...mockPersonas]
    savePersonas(updatedPersonas)
    setIsGenerating(false)
    setBrief('')
  }

  const exportPersona = (persona: Persona, format: 'pdf' | 'csv' | 'json') => {
    const dataStr = JSON.stringify(persona, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `persona_${persona.name.replace(' ', '_')}.${format}`
    link.click()
  }

  const deletePersona = (personaId: string) => {
    const updatedPersonas = personas.filter(p => p.id !== personaId)
    savePersonas(updatedPersonas)
    if (selectedPersona?.id === personaId) {
      setSelectedPersona(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PersonaCraft</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Session: {sessionData?.totalPersonas || 0} personas créés
              </span>
              <button className="btn-secondary text-sm">
                Exporter Tout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Panneau de génération */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Générer des Personas
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brief Marketing
                  </label>
                  <textarea
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="Décrivez votre produit, votre cible, vos objectifs marketing..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={isGenerating}
                  />
                </div>
                
                <button
                  onClick={generatePersonas}
                  disabled={!brief.trim() || isGenerating}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    !brief.trim() || isGenerating
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Génération en cours...</span>
                    </div>
                  ) : (
                    '🚀 Générer des Personas'
                  )}
                </button>
              </div>

              {sessionData && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Statistiques de Session</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>Personas créés: {sessionData.totalPersonas}</p>
                    <p>Session démarrée: {new Date(sessionData.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Liste des personas */}
          <div className="lg:col-span-2">
            {personas.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun persona créé
                </h3>
                <p className="text-gray-600 mb-6">
                  Commencez par décrire votre brief marketing pour générer vos premiers personas
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Mes Personas ({personas.length})
                  </h2>
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-sm">
                      Filtrer
                    </button>
                    <button className="btn-secondary text-sm">
                      Trier
                    </button>
                  </div>
                </div>

                <div className="grid gap-6">
                  {personas.map((persona) => (
                    <div key={persona.id} className="persona-card">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {persona.name}
                          </h3>
                          <p className="text-gray-600">
                            {persona.age} ans • {persona.occupation} • {persona.location}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            persona.qualityScore >= 90 ? 'bg-green-100 text-green-800' :
                            persona.qualityScore >= 80 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Score: {persona.qualityScore}%
                          </span>
                          <button
                            onClick={() => setSelectedPersona(selectedPersona?.id === persona.id ? null : persona)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {selectedPersona?.id === persona.id ? 'Masquer' : 'Détails'}
                          </button>
                        </div>
                      </div>

                      {selectedPersona?.id === persona.id && (
                        <div className="border-t pt-4 space-y-4 animate-slide-up">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Démographiques</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>Revenus: {persona.demographics.income}</li>
                                <li>Éducation: {persona.demographics.education}</li>
                                <li>Situation: {persona.demographics.familyStatus}</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Données Culturelles</h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p>Musique: {persona.culturalData.music.join(', ')}</p>
                                <p>Marques: {persona.culturalData.brands.join(', ')}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Points de Douleur</h4>
                            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                              {persona.painPoints.map((point, index) => (
                                <li key={index}>{point}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => exportPersona(persona, 'json')}
                                className="btn-secondary text-sm"
                              >
                                📄 JSON
                              </button>
                              <button
                                onClick={() => exportPersona(persona, 'pdf')}
                                className="btn-secondary text-sm"
                              >
                                📑 PDF
                              </button>
                              <button
                                onClick={() => exportPersona(persona, 'csv')}
                                className="btn-secondary text-sm"
                              >
                                📊 CSV
                              </button>
                            </div>
                            <button
                              onClick={() => deletePersona(persona.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

