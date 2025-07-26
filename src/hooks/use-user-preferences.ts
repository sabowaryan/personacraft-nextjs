import { useState, useCallback, useEffect } from 'react'
import { useUser } from '@stackframe/stack'

export interface UserPreferences {
  language: 'fr' | 'en'
  theme: 'light' | 'dark'
  autoSave: boolean
}

interface UseUserPreferencesReturn {
  preferences: UserPreferences
  isLoading: boolean
  error: string | null
  updatePreferences: (updates: Partial<UserPreferences>) => void
  setLanguage: (language: 'fr' | 'en') => void
  toggleTheme: () => void
  toggleAutoSave: () => void
}

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'fr',
  theme: 'light',
  autoSave: true
}

const PREFERENCES_STORAGE_KEY = 'personacraft_preferences'

export function useUserPreferences(): UseUserPreferencesReturn {
  const user = useUser()
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Générer une clé de stockage unique par utilisateur
  const getStorageKey = useCallback(() => {
    if (user?.id) {
      return `${PREFERENCES_STORAGE_KEY}_${user.id}`
    }
    return PREFERENCES_STORAGE_KEY // Fallback pour les utilisateurs non connectés
  }, [user?.id])

  // Charger les préférences depuis le localStorage
  const loadPreferences = useCallback(() => {
    try {
      setIsLoading(true)
      setError(null)

      const storageKey = getStorageKey()
      const stored = localStorage.getItem(storageKey)

      if (stored) {
        const parsedPreferences = JSON.parse(stored)
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsedPreferences })
      } else {
        setPreferences(DEFAULT_PREFERENCES)
      }
    } catch (err) {
      console.error('Erreur lors du chargement des préférences:', err)
      setError('Erreur lors du chargement des préférences')
      setPreferences(DEFAULT_PREFERENCES)
    } finally {
      setIsLoading(false)
    }
  }, [getStorageKey])

  // Sauvegarder les préférences dans le localStorage
  const savePreferencesToStorage = useCallback((prefs: UserPreferences) => {
    try {
      const storageKey = getStorageKey()
      localStorage.setItem(storageKey, JSON.stringify(prefs))
    } catch (err) {
      console.error('Erreur lors de la sauvegarde des préférences:', err)
      setError('Erreur lors de la sauvegarde des préférences')
    }
  }, [getStorageKey])

  // Charger les préférences au montage et quand l'utilisateur change
  useEffect(() => {
    loadPreferences()
  }, [loadPreferences])

  // Appliquer le thème au DOM
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', preferences.theme === 'dark')
    }
  }, [preferences.theme])

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    try {
      setError(null)

      setPreferences(prevPrefs => {
        const newPrefs = { ...prevPrefs, ...updates }
        savePreferencesToStorage(newPrefs)
        return newPrefs
      })
    } catch (err) {
      console.error('Erreur lors de la mise à jour des préférences:', err)
      setError('Erreur lors de la mise à jour des préférences')
    }
  }, [savePreferencesToStorage])

  const setLanguage = useCallback((language: 'fr' | 'en') => {
    updatePreferences({ language })
  }, [updatePreferences])

  const toggleTheme = useCallback(() => {
    const newTheme = preferences.theme === 'light' ? 'dark' : 'light'
    updatePreferences({ theme: newTheme })
  }, [preferences.theme, updatePreferences])

  const toggleAutoSave = useCallback(() => {
    updatePreferences({ autoSave: !preferences.autoSave })
  }, [preferences.autoSave, updatePreferences])

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    setLanguage,
    toggleTheme,
    toggleAutoSave
  }
}

export default useUserPreferences