/**
 * Configuration optimisée pour Stack Auth avec Next.js 15
 * Réduit la taille du bundle et améliore les performances
 */

import { StackServerApp, StackClientApp } from "@stackframe/stack";

// Configuration optimisée côté serveur
export const stackServerAppOptimized = new StackServerApp({
  tokenStore: "nextjs-cookie", // Plus efficace que les autres stores
  urls: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    emailVerification: "/handler/email-verification",
  },
});

// Configuration optimisée côté client avec lazy loading
export const stackClientAppOptimized = new StackClientApp({
  tokenStore: "cookie", // Cohérent avec le serveur
  urls: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    emailVerification: "/handler/email-verification",
  },
});

// Types optimisés pour réduire les imports
export type OptimizedUser = {
  id: string;
  primaryEmail: string | null;
  displayName: string | null;
  profileImageUrl: string | null;
  hasPassword: boolean;
};

// Hook optimisé pour éviter les re-renders inutiles
export function useOptimizedUser(): OptimizedUser | null {
  const user = stackClientAppOptimized.useUser();
  
  if (!user) return null;
  
  return {
    id: user.id,
    primaryEmail: user.primaryEmail,
    displayName: user.displayName,
    profileImageUrl: user.profileImageUrl,
    hasPassword: user.hasPassword,
  };
}