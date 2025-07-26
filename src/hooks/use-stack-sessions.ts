import { useState, useEffect, useCallback } from 'react'
import { StackAuthSessionService, StackSession, SessionListResponse } from '@/lib/stack-auth-sessions'

interface UseStackSessionsReturn {
  // État
  sessions: StackSession[]
  currentSession: StackSession | null
  isLoading: boolean
  error: string | null

  // Actions
  refreshSessions: () => Promise<void>
  revokeSession: (sessionId: string) => Promise<boolean>
  revokeAllOtherSessions: () => Promise<boolean>
  incrementGenerations: () => Promise<void>

  // Statistiques
  stats: {
    totalSessions: number
    activeSessions: number
    expiredSessions: number
    oldestSession?: Date
    newestSession?: Date
  }

  // Utilitaires
  formatSessionInfo: (session: StackSession) => {
    id: string
    isActive: boolean
    createdAt: string
    lastActive: string
    location?: string
    device?: string
    browser?: string
  }
}

export function useStackSessions(): UseStackSessionsReturn {
  const [sessions, setSessions] = useState<StackSession[]>([])
  const [currentSession, setCurrentSession] = useState<StackSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalSessions: 0,
    activeSessions: 0,
    expiredSessions: 0
  })

  // Charger les sessions au montage
  useEffect(() => {
    refreshSessions()
  }, [])

  const refreshSessions = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Charger toutes les sessions
      const sessionData = await StackAuthSessionService.listSessions()
      setSessions(sessionData.sessions)

      // Charger la session actuelle
      const current = await StackAuthSessionService.getCurrentSession()
      setCurrentSession(current)

      // Charger les statistiques
      const sessionStats = await StackAuthSessionService.getSessionStats()
      setStats(sessionStats)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des sessions'
      setError(errorMessage)
      console.error('Erreur dans useStackSessions:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const revokeSession = useCallback(async (sessionId: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const success = await StackAuthSessionService.revokeSession(sessionId)

      if (success) {
        // Rafraîchir la liste des sessions après révocation
        await refreshSessions()
      } else {
        setError('Échec de la révocation de la session')
      }

      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la révocation de la session'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [refreshSessions])

  const revokeAllOtherSessions = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const success = await StackAuthSessionService.revokeAllOtherSessions()

      if (success) {
        // Rafraîchir la liste des sessions après révocation
        await refreshSessions()
      } else {
        setError('Échec de la révocation des autres sessions')
      }

      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la révocation des sessions'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [refreshSessions])

  const incrementGenerations = useCallback(async () => {
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'increment_generations'
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'incrémentation des générations')
      }
    } catch (err) {
      console.error('Erreur lors de l\'incrémentation des générations:', err)
    }
  }, [])

  const formatSessionInfo = useCallback((session: StackSession) => {
    return StackAuthSessionService.formatSessionInfo(session)
  }, [])

  return {
    sessions,
    currentSession,
    isLoading,
    error,
    refreshSessions,
    revokeSession,
    revokeAllOtherSessions,
    incrementGenerations,
    stats,
    formatSessionInfo
  }
}

export default useStackSessions