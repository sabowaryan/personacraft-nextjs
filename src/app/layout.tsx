import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

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
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}

