import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
      {/* Navigation */}
      <nav className="nav-header">
        <div className="container-main py-4">
          <div className="flex items-center justify-between">
            <div className="nav-brand">
              <div className="nav-logo">PC</div>
              <div>
                <h1 className="nav-title">PersonaCraft</h1>
                <p className="text-sm text-neutral-600">AI-Powered Marketing Personas</p>
              </div>
            </div>
            <Link href="/dashboard" className="btn-primary">
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-main py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
              Créez des{' '}
              <span className="text-gradient">personas marketing</span>{' '}
              avec l'IA
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
              Générez des personas détaillés et authentiques en moins de 60 secondes 
              grâce à Google Gemini et Qloo Taste AI™
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
              🚀 Générer mes personas
            </Link>
            <button className="btn-secondary text-lg px-8 py-4">
              📖 Voir la démo
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="card text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Précision IA
              </h3>
              <p className="text-neutral-600">
                Alimenté par Google Gemini pour des personas détaillés et cohérents
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Insights Culturels
              </h3>
              <p className="text-neutral-600">
                Enrichi par Qloo Taste AI™ pour des données culturelles authentiques
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Génération Rapide
              </h3>
              <p className="text-neutral-600">
                De votre brief marketing à vos personas en moins d'une minute
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-20">
        <div className="container-main">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Comment ça fonctionne
            </h2>
            <p className="text-xl text-neutral-600">
              Trois étapes simples pour des personas professionnels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Décrivez votre projet
              </h3>
              <p className="text-neutral-600">
                Saisissez votre brief marketing : produit, cible, objectifs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                L'IA génère vos personas
              </h3>
              <p className="text-neutral-600">
                Gemini et Qloo créent des personas détaillés avec données culturelles
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Exportez et utilisez
              </h3>
              <p className="text-neutral-600">
                Téléchargez vos personas en JSON, CSV ou PDF pour vos campagnes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary py-20">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à révolutionner votre marketing ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez les marketeurs qui utilisent PersonaCraft pour créer 
            des campagnes plus ciblées et efficaces
          </p>
          <Link href="/dashboard" className="btn-secondary bg-white text-primary-600 hover:bg-neutral-50">
            Commencer gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container-main">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="nav-brand mb-4 md:mb-0">
              <div className="nav-logo bg-primary-600">PC</div>
              <div>
                <h3 className="text-lg font-semibold text-white">PersonaCraft</h3>
                <p className="text-sm text-neutral-400">AI-Powered Marketing Personas</p>
              </div>
            </div>
            <div className="text-sm text-neutral-400">
              © 2025 PersonaCraft. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

