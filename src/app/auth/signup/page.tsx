'use client';

import { SignUp } from "@stackframe/stack";
import Link from "next/link";

export default function CustomSignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-purple-600 mb-2">PersonaCraft</h1>
          </Link>
          <p className="text-gray-600">
            Créez votre compte et commencez à générer des personas marketing
          </p>
        </div>

        {/* Sign Up Component */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 text-center">
              Créer un compte
            </h2>
            <p className="text-gray-600 text-center mt-2">
              Rejoignez PersonaCraft gratuitement
            </p>
          </div>
          
          <SignUp />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{" "}
              <Link href="/auth/signin" className="text-purple-600 hover:text-purple-700 font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8">
          <div className="bg-white/50 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="font-semibold text-gray-900 mb-4 text-center">
              Pourquoi choisir PersonaCraft ?
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Génération de personas en moins de 60 secondes</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Insights culturels authentiques avec Qloo AI</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Export en JSON, CSV et PDF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

