'use client';

import { useState, useEffect } from 'react';
import { PersonaData } from '@/types';
import { 
  savePersonas, 
  loadPersonas, 
  exportToJSON, 
  exportToCSV,
  getSessionStats,
  saveSessionStats
} from '@/lib/session';

export default function Dashboard() {
  const [brief, setBrief] = useState('');
  const [personas, setPersonas] = useState<PersonaData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaData | null>(null);
  const [sessionStats, setSessionStats] = useState({ count: 0, startTime: new Date() });
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'age'>('score');
  const [filterBy, setFilterBy] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    const loadedPersonas = loadPersonas();
    setPersonas(loadedPersonas);
    
    const stats = getSessionStats();
    setSessionStats(stats);
  }, []);

  const generatePersonas = async () => {
    if (!brief.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief })
      });

      if (response.ok) {
        const newPersonas = await response.json();
        const updatedPersonas = [...personas, ...newPersonas];
        setPersonas(updatedPersonas);
        savePersonas(updatedPersonas);
        
        const newStats = {
          count: sessionStats.count + newPersonas.length,
          startTime: sessionStats.startTime
        };
        setSessionStats(newStats);
        saveSessionStats(newStats);
        
        setBrief('');
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const deletePersona = (id: string) => {
    const updatedPersonas = personas.filter(p => p.id !== id);
    setPersonas(updatedPersonas);
    savePersonas(updatedPersonas);
    setSelectedPersona(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'badge-success';
    if (score >= 75) return 'badge-warning';
    return 'badge-error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Bon';
    return 'Moyen';
  };

  const filteredPersonas = personas.filter(persona => {
    if (filterBy === 'all') return true;
    if (filterBy === 'high') return persona.qualityScore >= 90;
    if (filterBy === 'medium') return persona.qualityScore >= 75 && persona.qualityScore < 90;
    if (filterBy === 'low') return persona.qualityScore < 75;
    return true;
  });

  const sortedPersonas = [...filteredPersonas].sort((a, b) => {
    if (sortBy === 'score') return b.qualityScore - a.qualityScore;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'age') return a.age - b.age;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Navigation */}
      <nav className="nav-header">
        <div className="container-main py-4">
          <div className="flex items-center justify-between">
            <div className="nav-brand">
              <div className="nav-logo">PC</div>
              <div>
                <h1 className="nav-title">PersonaCraft</h1>
                <p className="text-sm text-neutral-600">AI-Powered Marketing Persona Generation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-neutral-600">
                Session: {sessionStats.count} personas créés
              </div>
              <button
                onClick={() => exportToJSON(personas)}
                className="btn-outline"
                disabled={personas.length === 0}
              >
                Exporter Tout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-main py-8">
        <div className="grid-dashboard">
          {/* Section Génération */}
          <div className="lg:col-span-1">
            <div className="card space-y-6">
              <div>
                <h2 className="section-subtitle">Générer des Personas</h2>
                <p className="text-sm text-neutral-600 mb-4">
                  Décrivez votre produit, votre cible, vos objectifs marketing...
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="brief" className="block text-sm font-medium text-neutral-700 mb-2">
                    Brief Marketing
                  </label>
                  <textarea
                    id="brief"
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="Décrivez votre produit, votre cible, vos objectifs marketing..."
                    className="textarea-field h-32"
                    disabled={isGenerating}
                  />
                </div>

                <button
                  onClick={generatePersonas}
                  disabled={!brief.trim() || isGenerating}
                  className="btn-primary w-full"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="loading-spinner"></div>
                      <span>Génération en cours...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>🚀</span>
                      <span>Générer des Personas</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Statistiques de Session */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Statistiques de Session</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Personas créés:</span>
                    <span className="font-medium">{sessionStats.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Session démarrée:</span>
                    <span className="font-medium">
                      {sessionStats.startTime.toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Personas */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-subtitle mb-0">Mes Personas ({personas.length})</h2>
                <div className="flex items-center space-x-3">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as any)}
                    className="btn-outline text-sm"
                  >
                    <option value="all">Tous</option>
                    <option value="high">Score élevé (90+)</option>
                    <option value="medium">Score moyen (75-89)</option>
                    <option value="low">Score faible (&lt;75)</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="btn-outline text-sm"
                  >
                    <option value="score">Trier par score</option>
                    <option value="name">Trier par nom</option>
                    <option value="age">Trier par âge</option>
                  </select>
                </div>
              </div>

              {personas.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Aucun persona créé</h3>
                  <p className="text-neutral-600">Commencez par générer vos premiers personas marketing</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedPersonas.map((persona) => (
                    <div key={persona.id} className="persona-card">
                      <div className="persona-header">
                        <div className="flex-1">
                          <h3 className="persona-name">{persona.name}</h3>
                          <p className="persona-details">
                            {persona.age} ans • {persona.profession} • {persona.location}
                          </p>
                        </div>
                        <div className="persona-score">
                          <div className={`badge ${getScoreColor(persona.qualityScore)} mb-2`}>
                            Score: {persona.qualityScore}%
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedPersona(selectedPersona?.id === persona.id ? null : persona)}
                              className="btn-outline text-sm"
                            >
                              {selectedPersona?.id === persona.id ? 'Masquer' : 'Détails'}
                            </button>
                            <button
                              onClick={() => deletePersona(persona.id)}
                              className="btn-ghost text-error-600 hover:text-error-700 text-sm"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>

                      {selectedPersona?.id === persona.id && (
                        <div className="mt-6 pt-6 border-t border-neutral-200 animate-slide-up">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-neutral-900 mb-3">Démographiques</h4>
                              <div className="space-y-2 text-sm">
                                <div><span className="text-neutral-600">Revenus:</span> {persona.income}</div>
                                <div><span className="text-neutral-600">Éducation:</span> {persona.education}</div>
                                <div><span className="text-neutral-600">Situation:</span> {persona.familyStatus}</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-neutral-900 mb-3">Données Culturelles</h4>
                              <div className="space-y-2 text-sm">
                                <div><span className="text-neutral-600">Musique:</span> {persona.culturalData?.music}</div>
                                <div><span className="text-neutral-600">Marques:</span> {persona.culturalData?.brands}</div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <h4 className="font-medium text-neutral-900 mb-3">Points de Douleur</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-700">
                              {persona.painPoints.map((point, index) => (
                                <li key={index}>{point}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-6">
                            <h4 className="font-medium text-neutral-900 mb-3">Objectifs</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-700">
                              {persona.goals.map((goal, index) => (
                                <li key={index}>{goal}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-6">
                            <h4 className="font-medium text-neutral-900 mb-3">Insights Marketing</h4>
                            <p className="text-sm text-neutral-700">{persona.marketingInsights}</p>
                          </div>

                          <div className="mt-6 flex space-x-3">
                            <button
                              onClick={() => exportToJSON([persona])}
                              className="btn-secondary"
                            >
                              Exporter JSON
                            </button>
                            <button
                              onClick={() => exportToCSV([persona])}
                              className="btn-secondary"
                            >
                              Exporter CSV
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

