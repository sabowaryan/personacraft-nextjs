'use client';

import { useState } from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  preview: string;
  isPopular?: boolean;
  isPremium?: boolean;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'E-commerce Customer',
    description: 'Persona type pour clients d\'e-commerce avec comportements d\'achat détaillés',
    category: 'E-commerce',
    tags: ['Shopping', 'Conversion', 'UX'],
    preview: 'Femme, 28-35 ans, acheteuse en ligne régulière...',
    isPopular: true
  },
  {
    id: '2',
    name: 'SaaS User',
    description: 'Template pour utilisateurs de logiciels SaaS B2B',
    category: 'SaaS',
    tags: ['B2B', 'Productivité', 'Tech'],
    preview: 'Professionnel, 30-45 ans, utilise des outils digitaux...',
    isPremium: true
  },
  {
    id: '3',
    name: 'Mobile App User',
    description: 'Persona pour applications mobiles grand public',
    category: 'Mobile',
    tags: ['Mobile', 'App', 'Engagement'],
    preview: 'Utilisateur mobile actif, 18-30 ans...'
  },
  {
    id: '4',
    name: 'Healthcare Patient',
    description: 'Template pour patients dans le secteur de la santé',
    category: 'Healthcare',
    tags: ['Santé', 'Patient', 'Care'],
    preview: 'Patient soucieux de sa santé, 35-60 ans...'
  },
  {
    id: '5',
    name: 'EdTech Student',
    description: 'Persona pour étudiants utilisant des plateformes éducatives',
    category: 'Education',
    tags: ['Education', 'Learning', 'Student'],
    preview: 'Étudiant motivé, 16-25 ans, apprend en ligne...'
  },
  {
    id: '6',
    name: 'FinTech User',
    description: 'Template pour utilisateurs d\'applications financières',
    category: 'Finance',
    tags: ['Finance', 'Banking', 'Investment'],
    preview: 'Professionnel financier, 25-40 ans...',
    isPopular: true
  }
];

const categories = ['Tous', 'E-commerce', 'SaaS', 'Mobile', 'Healthcare', 'Education', 'Finance'];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'Tous' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template: Template) => {
    // Logique pour utiliser le template
    console.log('Using template:', template.id);
    // Ici on pourrait rediriger vers une page de création avec le template pré-rempli
  };

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Templates de Personas</h1>
            <p className="text-neutral-600 mt-2">
              Utilisez nos templates pré-conçus pour créer rapidement des personas efficaces
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {templates.length} templates disponibles
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Rechercher un template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all duration-200 hover:shadow-lg group"
          >
            <div className="p-6">
              {/* Header with badges */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">{template.category}</p>
                </div>
                <div className="flex flex-col gap-1">
                  {template.isPopular && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Populaire
                    </span>
                  )}
                  {template.isPremium && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Premium
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                {template.description}
              </p>

              {/* Preview */}
              <div className="bg-neutral-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-neutral-500 mb-1">Aperçu:</p>
                <p className="text-sm text-neutral-700 italic">"{template.preview}"</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handlePreviewTemplate(template)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  Aperçu
                </button>
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  Utiliser
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-neutral-900">Aucun template trouvé</h3>
          <p className="mt-2 text-neutral-500">
            Essayez de modifier vos critères de recherche ou de sélectionner une autre catégorie.
          </p>
        </div>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">{selectedTemplate.name}</h2>
                  <p className="text-neutral-600 mt-1">{selectedTemplate.category}</p>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Description</h3>
                  <p className="text-neutral-600">{selectedTemplate.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Aperçu du contenu</h3>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-neutral-700">{selectedTemplate.preview}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={() => {
                      handleUseTemplate(selectedTemplate);
                      setSelectedTemplate(null);
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                  >
                    Utiliser ce template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}