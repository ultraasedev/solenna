import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { locales } from '../../i18n'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'Solenna - Mutuelle solidaire pour maladies chroniques',
  description: 'La première e-mutuelle qui prend en charge à 100% vos maladies chroniques. Plus jamais d\'avance de frais pour l\'endométriose, diabète, maladies cardiovasculaires.',
  keywords: ['mutuelle', 'santé', 'endométriose', 'maladies chroniques', 'diabète', 'cardiovasculaire', 'cancer'],
  authors: [{ name: 'Solenna' }],
  creator: 'Solenna',
  publisher: 'Solenna',
  openGraph: {
    title: 'Solenna - Mutuelle solidaire pour maladies chroniques',
    description: 'La première e-mutuelle qui prend en charge à 100% vos maladies chroniques.',
    url: 'https://Solenna.fr',
    siteName: 'Solenna',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Solenna - Mutuelle solidaire',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solenna - Mutuelle solidaire pour maladies chroniques',
    description: 'La première e-mutuelle qui prend en charge à 100% vos maladies chroniques.',
    images: ['/og-image.jpg'],
    creator: '@Solenna_mutuelle',
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
  verification: {
    google: 'google-site-verification-token',
  },
}

export default async function RootLayout({
  children,
  params
}: Props) {
  const { locale } = await params
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound()

  // Providing all messages to the client side
  const messages = await getMessages()

  return (
    <html lang={locale} className={inter.className}>
      <body className="min-h-screen bg-white">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}