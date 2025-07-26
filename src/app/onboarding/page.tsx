'use client';

import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import LogoWithText from "@/components/LogoWithText";

export default function OnboardingPage() {
  const user = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    industry: '',
    teamSize: '',
    useCase: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to signin if user is not authenticated
  if (user === null) {
    router.push('/auth/signin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) {
        console.error('Utilisateur non authentifié');
        router.push('/auth/signin');
        return;
      }

      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'onboarding');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Erreur lors de l\'onboarding:', error);
      // Vous pourriez ajouter un état d'erreur ici pour l'afficher à l'utilisateur
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <LogoWithText 
              size="xl" 
              variant="primary" 
              text="PersonaCraft" 
              className="mb-2 justify-center" 
            />
          </Link>
          <p className="text-gray-600">
            Personnalisez votre expérience pour des personas plus précis
          </p>
        </div>

        {/* Onboarding Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 text-center">
              Bienvenue sur PersonaCraft !
            </h2>
            <p className="text-gray-600 text-center mt-2">
              Aidez-nous à personnaliser votre expérience en nous en disant plus sur vous
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Entreprise ou organisation
              </label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ex: TechStart, Freelance, etc."
                required
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Votre rôle
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionnez votre rôle</option>
                <option value="marketing-manager">Directeur Marketing</option>
                <option value="growth-hacker">Growth Hacker</option>
                <option value="product-manager">Chef de Produit</option>
                <option value="consultant">Consultant Marketing</option>
                <option value="entrepreneur">Entrepreneur</option>
                <option value="freelancer">Freelance</option>
                <option value="other">Autre</option>
              </select>
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                Secteur d'activité
              </label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionnez votre secteur</option>
                <option value="tech">Technologie</option>
                <option value="ecommerce">E-commerce</option>
                <option value="saas">SaaS</option>
                <option value="fashion">Mode</option>
                <option value="health">Santé</option>
                <option value="finance">Finance</option>
                <option value="education">Éducation</option>
                <option value="consulting">Conseil</option>
                <option value="other">Autre</option>
              </select>
            </div>

            {/* Team Size */}
            <div>
              <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-2">
                Taille de l'équipe
              </label>
              <select
                id="teamSize"
                value={formData.teamSize}
                onChange={(e) => handleInputChange('teamSize', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionnez la taille</option>
                <option value="solo">Solo (1 personne)</option>
                <option value="small">Petite équipe (2-10)</option>
                <option value="medium">Équipe moyenne (11-50)</option>
                <option value="large">Grande équipe (51-200)</option>
                <option value="enterprise">Entreprise (200+)</option>
              </select>
            </div>

            {/* Use Case */}
            <div>
              <label htmlFor="useCase" className="block text-sm font-medium text-gray-700 mb-2">
                Principal cas d'usage
              </label>
              <select
                id="useCase"
                value={formData.useCase}
                onChange={(e) => handleInputChange('useCase', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionnez votre cas d'usage</option>
                <option value="campaign-planning">Planification de campagnes</option>
                <option value="content-strategy">Stratégie de contenu</option>
                <option value="product-development">Développement produit</option>
                <option value="market-research">Étude de marché</option>
                <option value="client-work">Travail client</option>
                <option value="personal-project">Projet personnel</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Configuration en cours...' : 'Commencer avec PersonaCraft'}
            </button>
          </form>

          {/* Skip Option */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Passer cette étape
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600">Personas personnalisés</p>
          </div>
          <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600">Insights culturels</p>
          </div>
          <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600">Export multi-format</p>
          </div>
        </div>
      </div>
    </div>
  );
}

