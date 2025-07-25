'use client';

import { useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';

export function useOnboarding() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.clientMetadata?.onboarded) {
      router.push('/onboarding');
    }
  }, [user, router]);

  return {
    isOnboarded: user?.clientMetadata?.onboarded || false,
    userProfile: user?.clientMetadata || {},
  };
}

