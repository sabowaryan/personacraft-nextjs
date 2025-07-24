import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PersonaCraft - AI-Powered Marketing Persona Generation',
  description: 'Generate detailed, authentic marketing personas using Google Gemini and Qloo Taste AI™. Transform your marketing brief into actionable personas in under 60 seconds.',
  keywords: ['marketing personas', 'AI', 'Google Gemini', 'Qloo', 'marketing intelligence'],
  authors: [{ name: 'PersonaCraft Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          {children}
        </div>
      </body>
    </html>
  )
}

