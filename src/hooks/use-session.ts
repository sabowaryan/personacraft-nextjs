import { useState, useCallback, useEffect } from 'react'
import { SessionData, SessionPreferences } from '@/types'
import { SessionManager, BriefManager } from '@/lib/session'

interface UseSessionReturn {
  session: SessionData | null
  isLoading: boolean
  error: string | null
  // Session management
  createSession: () => SessionData
  updateSession: (updates: Partial<SessionData>) => void
  clearSession: () => void
  // Preferences
  updatePreferences: (preferences: Partial<SessionPreferences>) => void
  toggleTheme: () => void
  setLanguage: (language: 'fr' | 'en') => void
  toggleAutoSave: () => void
  // Brief management
  savedBriefs: string[]
  saveBrief: (brief: string) => void
  deleteBrief: (brief: string) => void
  clearBriefs: () => void
  // Session stats
  incrementGenerations: () => void
  updatePersonaCount: (count: number) => void
  getSessionDuration: () => number
  // Persistence
  exportSession: () => void
  importSession: (sessionData: SessionData) => void
}

export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<SessionData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedBriefs, setSavedBriefs] = useState<string[]>([])

  // Charger la session au montage
  useEffect(() => {
    loadSession()
    loadBriefs()
  }, [])

  const loadSession = useCallback(() => {
    setIsLoading(true)
    setError(null)

    try {
      const existingSession = SessionManager.getSession()
      if (existingSession) {
        setSession(existingSession)
      } else {
        // Créer une nouvelle session si aucune n'existe
        const newSession = SessionManager.createSession()
        setSession(newSession)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la session')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadBriefs = useCallback(() => {
    try {
      const briefs = BriefManager.getBriefs()
      setSavedBriefs(briefs)
    } catch (err) {
      console.error('Erreur lors du chargement des briefs:', err)
    }
  }, [])

  const createSession = useCallback((): SessionData => {
    setIsLoading(true)
    setError(null)

    try {
      const newSession = SessionManager.createSession()
      setSession(newSession)
      return newSession
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la création de la session'
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateSession = useCallback((updates: Partial<SessionData>) => {
    if (!session) return

    setIsLoading(true)
    setError(null)

    try {
      const updatedSession = SessionManager.updateSession(updates)
      if (updatedSession) {
        setSession(updatedSession)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la session')
    } finally {
      setIsLoading(false)
    }
  }, [session])

  const clearSession = useCallback(() => {
    setIsLoading(true)
    setError(null)

    try {
      SessionManager.clearSession()
      setSession(null)
      // Créer une nouvelle session immédiatement
      const newSession = SessionManager.createSession()
      setSession(newSession)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de la session')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updatePreferences = useCallback((preferences: Partial<SessionPreferences>) => {
    if (!session) return

    const updatedPreferences = {
      ...session.preferences,
      ...preferences
    }

    updateSession({ preferences: updatedPreferences })
  }, [session, updateSession])

  const toggleTheme = useCallback(() => {
    if (!session) return

    const newTheme = session.preferences.theme === 'light' ? 'dark' : 'light'
    updatePreferences({ theme: newTheme })

    // Appliquer le thème au document
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
  }, [session, updatePreferences])

  const setLanguage = useCallback((language: 'fr' | 'en') => {
    updatePreferences({ language })
  }, [updatePreferences])

  const toggleAutoSave = useCallback(() => {
    if (!session) return

    updatePreferences({ autoSave: !session.preferences.autoSave })
  }, [session, updatePreferences])

  const saveBrief = useCallback((brief: string) => {
    try {
      BriefManager.saveBrief(brief)
      setSavedBriefs(BriefManager.getBriefs())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde du brief')
    }
  }, [])

  const deleteBrief = useCallback((brief: string) => {
    try {
      BriefManager.deleteBrief(brief)
      setSavedBriefs(BriefManager.getBriefs())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du brief')
    }
  }, [])

  const clearBriefs = useCallback(() => {
    try {
      BriefManager.clearBriefs()
      setSavedBriefs([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression des briefs')
    }
  }, [])

  const incrementGenerations = useCallback(() => {
    if (!session) return

    updateSession({
      totalGenerations: session.totalGenerations + 1
    })
  }, [session, updateSession])

  const updatePersonaCount = useCallback((count: number) => {
    updateSession({ totalPersonas: count })
  }, [updateSession])

  const getSessionDuration = useCallback((): number => {
    if (!session) return 0

    const startTime = new Date(session.createdAt).getTime()
    const currentTime = Date.now()
    return Math.floor((currentTime - startTime) / 1000) // en secondes
  }, [session])

  const exportSession = useCallback(() => {
    if (!session) return

    try {
      const sessionData = {
        session,
        briefs: savedBriefs,
        exportedAt: new Date().toISOString()
      }

      const content = JSON.stringify(sessionData, null, 2)
      const blob = new Blob([content], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `personacraft_session_${session.id}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'export de la session')
    }
  }, [session, savedBriefs])

  const importSession = useCallback((sessionData: SessionData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Valider les données de session
      if (!sessionData.id || !sessionData.createdAt) {
        throw new Error('Données de session invalides')
      }

      SessionManager.saveSession(sessionData)
      setSession(sessionData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'import de la session')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Appliquer le thème au chargement
  useEffect(() => {
    if (session && typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', session.preferences.theme === 'dark')
    }
  }, [session])

  // Auto-save si activé
  useEffect(() => {
    if (session?.preferences.autoSave) {
      const interval = setInterval(() => {
        if (session) {
          SessionManager.updateSession({
            lastUpdated: new Date().toISOString()
          })
        }
      }, 30000) // Sauvegarde automatique toutes les 30 secondes

      return () => clearInterval(interval)
    }
  }, [session])

  return {
    session,
    isLoading,
    error,
    createSession,
    updateSession,
    clearSession,
    updatePreferences,
    toggleTheme,
    setLanguage,
    toggleAutoSave,
    savedBriefs,
    saveBrief,
    deleteBrief,
    clearBriefs,
    incrementGenerations,
    updatePersonaCount,
    getSessionDuration,
    exportSession,
    importSession
  }
}

export default useSession