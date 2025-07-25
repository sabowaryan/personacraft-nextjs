'use client';

import { SignIn } from "@stackframe/stack";
import Link from "next/link";

export default function CustomSignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-purple-600 mb-2">PersonaCraft</h1>
          </Link>
          <p className="text-gray-600">
            Connectez-vous pour générer vos personas marketing avec l'IA
          </p>
        </div>

        {/* Sign In Component */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 text-center">
              Connexion
            </h2>
            <p className="text-gray-600 text-center mt-2">
              Accédez à votre compte PersonaCraft
            </p>
          </div>
          
          <SignIn />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <Link href="/auth/signup" className="text-purple-600 hover:text-purple-700 font-medium">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Google Gemini AI</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Qloo Taste AI™</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

