// Fichier: src/i18n.ts
// Configuration principale pour l'internationalisation avec next-intl
// Ce fichier configure les traductions pour les locales FR et EN

import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// Liste des locales supportées par l'application
export const locales = ['fr', 'en'] as const
export type Locale = typeof locales[number]

export default getRequestConfig(async ({ locale }) => {
  // Valider que le paramètre `locale` entrant est valide
  if (!locale || !locales.includes(locale as Locale)) {
    notFound()
  }

  // Cast de locale pour TypeScript après validation
  const validLocale = locale as Locale

  return {
    // Charger les messages de traduction pour la locale demandée
    // Les fichiers JSON sont stockés dans le dossier messages/ à la racine
    messages: (await import(`../messages/${validLocale}.json`)).default,
    // next-intl exige EXPLICITEMENT la propriété locale dans le retour
    locale: validLocale
  }
})