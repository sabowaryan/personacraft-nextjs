import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { stackServerApp } from '../stack';
import { permissionService } from './services/permissionService';

export async function middleware(request: NextRequest) {
  const start = Date.now();

  const session = await stackServerApp.getSession();

  // Protéger les routes nécessitant une authentification
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session || !session.user) {
      return NextResponse.redirect(new URL('/handler/signin', request.url));
    }
  }

  // Exemple de vérification de permission pour une route spécifique
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session || !session.user) {
      return NextResponse.redirect(new URL('/handler/signin', request.url));
    }
    const isAdmin = await permissionService.hasPermission(session.user.id, 'admin_access');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }
  }

  // Exemple de vérification de limitation pour une route de création de persona
  if (request.nextUrl.pathname.startsWith('/create-persona')) {
    if (!session || !session.user) {
      return NextResponse.redirect(new URL('/handler/signin', request.url));
    }
    const canCreate = await permissionService.checkPersonaLimit(session.user.id);
    if (!canCreate) {
      return NextResponse.json({ error: 'Limite de création de personas atteinte pour votre plan.' }, { status: 403 });
    }
  }

  const response = NextResponse.next();

  const end = Date.now();
  const duration = end - start;
  console.log(`Request to ${request.nextUrl.pathname} took ${duration}ms`);

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/create-persona/:path*', '/api/:path*'],
};


