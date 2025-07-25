'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import LogoWithText from './LogoWithText';

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getLinkClasses = (href: string) => {
        const isActive = pathname === href;
        const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
        
        if (isActive) {
            return `${baseClasses} bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700`;
        }
        
        return `${baseClasses} text-gray-700 dark:text-gray-300 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-gray-100 dark:hover:bg-gray-800`;
    };

    const getMobileLinkClasses = (href: string) => {
        const isActive = pathname === href;
        const baseClasses = "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200";
        
        if (isActive) {
            return `${baseClasses} bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700`;
        }
        
        return `${baseClasses} text-gray-700 dark:text-gray-300 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-gray-100 dark:hover:bg-gray-800`;
    };
    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-300 dark:border-gray-700 backdrop-blur-sm bg-white/95 dark:bg-gray-950/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <LogoWithText 
                                text="PersonaCraft" 
                                size="md" 
                                variant="primary"
                                className="hover:opacity-80 transition-opacity duration-200"
                            />
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link
                                href="/"
                                className={getLinkClasses("/")}
                            >
                                Accueil
                            </Link>
                            <Link
                                href="/dashboard"
                                className={getLinkClasses("/dashboard")}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/features"
                                className={getLinkClasses("/features")}
                            >
                                Fonctionnalités
                            </Link>
                            <Link
                                href="/docs"
                                className={getLinkClasses("/docs")}
                            >
                                Documentation
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 dark:text-gray-300 hover:text-violet-700 dark:hover:text-violet-300 focus:outline-none focus:text-violet-700 dark:focus:text-violet-300 transition-colors duration-200"
                            aria-label="Menu"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-700">
                    <Link
                        href="/"
                        className={getMobileLinkClasses("/")}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Accueil
                    </Link>
                    <Link
                        href="/dashboard"
                        className={getMobileLinkClasses("/dashboard")}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/features"
                        className={getMobileLinkClasses("/features")}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Fonctionnalités
                    </Link>
                    <Link
                        href="/docs"
                        className={getMobileLinkClasses("/docs")}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Documentation
                    </Link>
                </div>
            </div>
        </nav>
    );
}