import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PersonaCraft - AI-Powered Marketing Persona Generation',
  description: 'Créez des personas marketing détaillés et précis grâce à l\'intelligence artificielle. Générez des insights culturels avec Google Gemini et Qloo Taste AI.',
  keywords: 'personas marketing, intelligence artificielle, Gemini, Qloo, marketing digital, analyse d\'audience',
  authors: [{ name: 'PersonaCraft Team' }],
  creator: 'PersonaCraft',
  publisher: 'PersonaCraft',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'PersonaCraft - AI-Powered Marketing Persona Generation',
    description: 'Créez des personas marketing détaillés et précis grâce à l\'intelligence artificielle.',
    siteName: 'PersonaCraft',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PersonaCraft - AI-Powered Marketing Persona Generation',
    description: 'Créez des personas marketing détaillés et précis grâce à l\'intelligence artificielle.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable} scroll-smooth`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="57x57" href="/assets/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/assets/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/assets/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/assets/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/assets/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/assets/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/assets/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/assets/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-icon-180x180.png" />

        {/* Standard Icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/assets/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png" />

        {/* Manifest and MS Tiles */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#7C3AED" />
        <meta name="msapplication-TileImage" content="/assets/ms-icon-144x144.png" />
        <meta name="theme-color" content="#7C3AED" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}

