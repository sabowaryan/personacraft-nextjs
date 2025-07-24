import { useState } from 'react'

// Utilitaires pour la gestion des sessions et persistance locale

export interface SessionData {
  id: string
  createdAt: string
  lastUpdated?: string
  totalPersonas: number
  totalGenerations: number
  preferences: {
    theme: 'light' | 'dark'
    language: 'fr' | 'en'
    autoSave: boolean
  }
}

export interface PersonaData {
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
  brief?: string
}

const SESSION_KEY = 'personacraft_session'
const PERSONAS_KEY = 'personacraft_personas'
const BRIEFS_KEY = 'personacraft_briefs'

// Gestion des sessions
export class SessionManager {
  static createSession(): SessionData {
    const session: SessionData = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      totalPersonas: 0,
      totalGenerations: 0,
      preferences: {
        theme: 'light',
        language: 'fr',
        autoSave: true
      }
    }
    
    this.saveSession(session)
    return session
  }

  static getSession(): SessionData | null {
    if (typeof window === 'undefined') return null
    
    try {
      const sessionData = localStorage.getItem(SESSION_KEY)
      return sessionData ? JSON.parse(sessionData) : null
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error)
      return null
    }
  }

  static saveSession(session: SessionData): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la session:', error)
    }
  }

  static updateSession(updates: Partial<SessionData>): SessionData | null {
    const currentSession = this.getSession()
    if (!currentSession) return null

    const updatedSession = {
      ...currentSession,
      ...updates,
      lastUpdated: new Date().toISOString()
    }

    this.saveSession(updatedSession)
    return updatedSession
  }

  static clearSession(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(SESSION_KEY)
  }
}

// Gestion des personas
export class PersonaManager {
  static getPersonas(): PersonaData[] {
    if (typeof window === 'undefined') return []
    
    try {
      const personasData = localStorage.getItem(PERSONAS_KEY)
      return personasData ? JSON.parse(personasData) : []
    } catch (error) {
      console.error('Erreur lors de la récupération des personas:', error)
      return []
    }
  }

  static savePersonas(personas: PersonaData[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(PERSONAS_KEY, JSON.stringify(personas))
      
      // Mettre à jour les stats de session
      SessionManager.updateSession({
        totalPersonas: personas.length
      })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des personas:', error)
    }
  }

  static addPersona(persona: PersonaData): void {
    const personas = this.getPersonas()
    personas.push(persona)
    this.savePersonas(personas)
  }

  static updatePersona(personaId: string, updates: Partial<PersonaData>): void {
    const personas = this.getPersonas()
    const index = personas.findIndex(p => p.id === personaId)
    
    if (index !== -1) {
      personas[index] = { ...personas[index], ...updates }
      this.savePersonas(personas)
    }
  }

  static deletePersona(personaId: string): void {
    const personas = this.getPersonas()
    const filteredPersonas = personas.filter(p => p.id !== personaId)
    this.savePersonas(filteredPersonas)
  }

  static clearPersonas(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(PERSONAS_KEY)
    SessionManager.updateSession({ totalPersonas: 0 })
  }

  static exportPersona(persona: PersonaData, format: 'json' | 'csv' | 'pdf'): void {
    let content: string
    let mimeType: string
    let filename: string

    switch (format) {
      case 'json':
        content = JSON.stringify(persona, null, 2)
        mimeType = 'application/json'
        filename = `persona_${persona.name.replace(/\s+/g, '_')}.json`
        break
      
      case 'csv':
        content = this.personaToCSV(persona)
        mimeType = 'text/csv'
        filename = `persona_${persona.name.replace(/\s+/g, '_')}.csv`
        break
      
      case 'pdf':
        // Pour le PDF, on utilise une représentation JSON pour l'instant
        content = JSON.stringify(persona, null, 2)
        mimeType = 'application/json'
        filename = `persona_${persona.name.replace(/\s+/g, '_')}.txt`
        break
      
      default:
        return
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  private static personaToCSV(persona: PersonaData): string {
    const headers = [
      'Nom', 'Âge', 'Profession', 'Localisation', 'Revenus', 'Éducation',
      'Situation familiale', 'Personnalité', 'Valeurs', 'Intérêts',
      'Style de vie', 'Musique', 'Films', 'Marques', 'Réseaux sociaux',
      'Points de douleur', 'Objectifs', 'Canaux préférés', 'Ton de message',
      'Comportement d\'achat', 'Score qualité', 'Date de création'
    ]

    const values = [
      persona.name,
      persona.age.toString(),
      persona.occupation,
      persona.location,
      persona.demographics.income,
      persona.demographics.education,
      persona.demographics.familyStatus,
      persona.psychographics.personality.join('; '),
      persona.psychographics.values.join('; '),
      persona.psychographics.interests.join('; '),
      persona.psychographics.lifestyle,
      persona.culturalData.music.join('; '),
      persona.culturalData.movies.join('; '),
      persona.culturalData.brands.join('; '),
      persona.culturalData.socialMedia.join('; '),
      persona.painPoints.join('; '),
      persona.goals.join('; '),
      persona.marketingInsights.preferredChannels.join('; '),
      persona.marketingInsights.messagingTone,
      persona.marketingInsights.buyingBehavior,
      persona.qualityScore.toString(),
      new Date(persona.createdAt).toLocaleDateString('fr-FR')
    ]

    return [headers.join(','), values.map(v => `"${v}"`).join(',')].join('\n')
  }
}

// Gestion des briefs sauvegardés
export class BriefManager {
  static getBriefs(): string[] {
    if (typeof window === 'undefined') return []
    
    try {
      const briefsData = localStorage.getItem(BRIEFS_KEY)
      return briefsData ? JSON.parse(briefsData) : []
    } catch (error) {
      console.error('Erreur lors de la récupération des briefs:', error)
      return []
    }
  }

  static saveBrief(brief: string): void {
    if (typeof window === 'undefined' || !brief.trim()) return
    
    const briefs = this.getBriefs()
    if (!briefs.includes(brief)) {
      briefs.unshift(brief) // Ajouter au début
      // Garder seulement les 10 derniers briefs
      if (briefs.length > 10) {
        briefs.splice(10)
      }
      
      try {
        localStorage.setItem(BRIEFS_KEY, JSON.stringify(briefs))
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du brief:', error)
      }
    }
  }

  static deleteBrief(brief: string): void {
    if (typeof window === 'undefined') return
    
    const briefs = this.getBriefs()
    const filteredBriefs = briefs.filter(b => b !== brief)
    
    try {
      localStorage.setItem(BRIEFS_KEY, JSON.stringify(filteredBriefs))
    } catch (error) {
      console.error('Erreur lors de la suppression du brief:', error)
    }
  }

  static clearBriefs(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(BRIEFS_KEY)
  }
}

// Hook personnalisé pour la gestion d'état
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Erreur lors de la lecture de ${key}:`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, error)
    }
  }

  return [storedValue, setValue] as const
}

// Fonctions d'export simples pour compatibilité
export const getSession = () => SessionManager.getSession()
export const updateSession = (updates: Partial<SessionData>) => SessionManager.updateSession(updates)
export const createSession = () => SessionManager.createSession()
export const savePersonas = (personas: PersonaData[]) => PersonaManager.savePersonas(personas)
export const getPersonas = () => PersonaManager.getPersonas()
export const loadPersonas = () => PersonaManager.getPersonas()
export const exportToJSON = (personas: PersonaData[]) => {
  if (personas.length === 1) {
    PersonaManager.exportPersona(personas[0], 'json')
  } else {
    const content = JSON.stringify(personas, null, 2)
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'personas.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
export const exportToCSV = (personas: PersonaData[]) => {
  if (personas.length === 1) {
    PersonaManager.exportPersona(personas[0], 'csv')
  } else {
    // Export multiple personas to CSV
    const headers = [
      'Nom', 'Âge', 'Profession', 'Localisation', 'Score qualité', 'Date de création'
    ]
    const rows = personas.map(p => [
      p.name, p.age.toString(), p.profession || p.occupation, p.location, 
      p.qualityScore.toString(), new Date(p.createdAt).toLocaleDateString('fr-FR')
    ])
    const csvContent = [headers.join(','), ...rows.map(row => row.map(v => `"${v}"`).join(','))].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'personas.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
export const getSessionStats = () => {
  const session = SessionManager.getSession()
  if (session) {
    return {
      count: session.totalPersonas,
      startTime: new Date(session.createdAt)
    }
  }
  return {
    count: 0,
    startTime: new Date()
  }
}
export const saveSessionStats = (stats: { count: number; startTime: Date }) => {
  SessionManager.updateSession({
    totalPersonas: stats.count
  })
}

