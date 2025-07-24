'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PersonaCraft</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Fonctionnalités</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">Comment ça marche</a>
              <Link href="/dashboard" className="btn-primary">
                Commencer
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`relative py-20 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Générez des{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Personas Marketing
            </span>{' '}
            Authentiques
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transformez votre brief marketing en personas détaillés, authentiques et exploitables 
            en moins de 60 secondes grâce à l'IA hybride Google Gemini + Qloo Taste AI™.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
              🚀 Créer mes Personas
            </Link>
            <button className="btn-secondary text-lg px-8 py-4">
              📖 Voir la Démo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Clés
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète pour créer des personas marketing ultra-réalistes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="persona-card text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">IA Hybride</h3>
              <p className="text-gray-600">
                Combinaison puissante de Google Gemini et Qloo Taste AI™ pour des résultats ultra-réalistes
              </p>
            </div>

            <div className="persona-card text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Données Culturelles</h3>
              <p className="text-gray-600">
                Musique, films, marques, préférences lifestyle authentiques et actuelles
              </p>
            </div>

            <div className="persona-card text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Exports Pro</h3>
              <p className="text-gray-600">
                Formats PDF, CSV, JSON pour intégration facile dans vos outils marketing
              </p>
            </div>

            <div className="persona-card text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ultra Rapide</h3>
              <p className="text-gray-600">
                Génération complète en moins de 60 secondes avec analytics intégrées
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un processus simple en 3 étapes pour des résultats professionnels
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Décrivez votre projet</h3>
              <p className="text-gray-600">
                Saisissez votre brief marketing : produit, cible, objectifs, contraintes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">L'IA génère</h3>
              <p className="text-gray-600">
                Nos algorithmes créent des personas détaillés avec données culturelles authentiques
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Exportez & Utilisez</h3>
              <p className="text-gray-600">
                Téléchargez vos personas en PDF, CSV ou JSON et intégrez-les dans vos campagnes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à révolutionner votre marketing ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez les marketeurs qui utilisent déjà PersonaCraft pour créer des campagnes plus efficaces
          </p>
          <Link href="/dashboard" className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl">
            Commencer Gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <span className="text-xl font-bold">PersonaCraft</span>
            </div>
            <p className="text-gray-400 mb-4">
              Powered by Google Gemini & Qloo Taste AI™
            </p>
            <p className="text-gray-500 text-sm">
              © 2025 PersonaCraft. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

