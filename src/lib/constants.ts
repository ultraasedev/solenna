/*
  Fichier: src/lib/constants.ts
  Constantes globales de l'application Solena
  Configuration des pathologies, tarifs, animations et autres valeurs fixes
*/

// Configuration des pathologies prises en charge
export const PATHOLOGIES = {
  ENDOMETRIOSIS: 'endometriosis',
  CARDIOVASCULAR: 'cardiovascular', 
  DIABETES: 'diabetes',
  CANCER: 'cancer',
  MENTAL_HEALTH: 'mentalHealth',
  CHRONIC: 'chronic'
} as const

// Type dérivé pour les pathologies
export type PathologyTypeConst = typeof PATHOLOGIES[keyof typeof PATHOLOGIES]

// Configuration des formules tarifaires
export const PRICING_TIERS = {
  ESSENTIAL: {
    id: 'essential',
    name: 'essential',
    basePrice: 60,
    features: [
      'Mutuelle complète (médecin, dentaire, optique)',
      'Téléconsultation 24h/7j',
      'Tiers payant généralisé',
      'Application mobile',
      'Chat avec conseillers santé'
    ],
    maxIncome: 1500,
    recommended: false
  },
  COMFORT: {
    id: 'comfort',
    name: 'comfort', 
    basePrice: 95,
    features: [
      'Tout l\'Essentiel inclus',
      'Pack pathologie chronique au choix',
      'Médecines douces (500€/an)',
      'Chambre individuelle',
      'Accompagnement personnalisé'
    ],
    recommended: true,
    maxIncome: 3000
  },
  PREMIUM: {
    id: 'premium',
    name: 'premium',
    basePrice: 165, 
    features: [
      'Tout le Confort inclus',
      'Tous les packs pathologies',
      'Dépassements d\'honoraires illimités',
      'Concierge santé',
      'Coaching nutrition/sport'
    ],
    maxIncome: Infinity,
    recommended: false
  }
} as const

// Type dérivé pour les formules
export type PricingTierConst = typeof PRICING_TIERS[keyof typeof PRICING_TIERS]

// Montants de couverture par pathologie (en euros/an)
export const COVERAGE_AMOUNTS = {
  [PATHOLOGIES.ENDOMETRIOSIS]: 15000,
  [PATHOLOGIES.CARDIOVASCULAR]: 12000,
  [PATHOLOGIES.DIABETES]: 8000,
  [PATHOLOGIES.CANCER]: 20000,
  [PATHOLOGIES.MENTAL_HEALTH]: 6000,
  [PATHOLOGIES.CHRONIC]: 10000
} as const

// Configuration des animations GSAP
export const ANIMATION_DURATIONS = {
  FAST: 0.3,      // Micro-interactions
  NORMAL: 0.6,    // Animations standard
  SLOW: 1.2,      // Animations d'entrée
  VERY_SLOW: 2.0  // Compteurs et effets spéciaux
} as const

// Easing curves pour GSAP
export const ANIMATION_EASINGS = {
  EASE_OUT: 'power2.out',
  EASE_IN: 'power2.in',
  EASE_IN_OUT: 'power2.inOut',
  BACK_OUT: 'back.out(1.7)',
  ELASTIC_OUT: 'elastic.out(1, 0.3)',
  BOUNCE_OUT: 'bounce.out'
} as const

// Breakpoints responsive (en pixels)
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
  LARGE_DESKTOP: 1400
} as const

// Configuration des couleurs du thème
export const THEME_COLORS = {
  PRIMARY: '#FF69B4',        // Rose principal
  PRIMARY_LIGHT: '#FFC0CB',  // Rose clair
  PRIMARY_PALE: '#FFE4E6',   // Rose très pâle
  SECONDARY: '#333333',      // Gris foncé
  SUCCESS: '#10B981',        // Vert succès
  WARNING: '#F59E0B',        // Orange warning
  ERROR: '#EF4444',          // Rouge erreur
  INFO: '#3B82F6'            // Bleu info
} as const

// Situations familiales
export const FAMILY_STATUS = {
  SINGLE: 'single',
  COUPLE: 'couple',
  FAMILY: 'family'
} as const

// Type dérivé pour les situations familiales
export type FamilyStatusConst = typeof FAMILY_STATUS[keyof typeof FAMILY_STATUS]

// Suppléments tarifaires par situation
export const FAMILY_SUPPLEMENTS = {
  [FAMILY_STATUS.SINGLE]: 0,
  [FAMILY_STATUS.COUPLE]: 40,    // Conjoint
  [FAMILY_STATUS.FAMILY]: 65     // Conjoint + 1 enfant moyen
} as const

// Pack pathologies chroniques (supplément mensuel)
export const CHRONIC_PACK_PRICE = 25

// Configuration des réseaux de soins partenaires
export const PARTNER_NETWORKS = {
  PHARMACIES: {
    name: 'Pharmacies partenaires',
    count: 3000,
    coverage: 'Tiers payant généralisé'
  },
  DOCTORS: {
    name: 'Médecins généralistes',
    count: 5000,
    coverage: '100% tarif conventionné'
  },
  SPECIALISTS: {
    name: 'Spécialistes',
    count: 2500,
    coverage: 'Tarifs négociés'
  },
  HOSPITALS: {
    name: 'Établissements hospitaliers',
    count: 150,
    coverage: 'Chambre individuelle'
  },
  OPTICAL: {
    name: 'Opticiens',
    count: 2000,
    coverage: 'Tiers payant intégral'
  },
  DENTAL: {
    name: 'Chirurgiens-dentistes',
    count: 1500,
    coverage: 'Devis gratuits'
  }
} as const

// Configuration API et endpoints
export const API_ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  STRIPE_CHECKOUT: '/stripe/checkout',
  SUBSCRIPTION: '/subscription',
  SIMULATOR: '/simulator',
  CONTACT: '/contact',
  PARTNERS: '/partners'
} as const

// Configuration Stripe
export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  SUCCESS_URL: '/subscription/success',
  CANCEL_URL: '/subscription/cancel',
  CURRENCY: 'eur',
  COUNTRY: 'FR'
} as const

// Limites et validations
export const VALIDATION_LIMITS = {
  MIN_INCOME: 500,           // Revenu minimum (€/mois)
  MAX_INCOME: 15000,         // Revenu maximum (€/mois)
  MIN_AGE: 16,               // Âge minimum pour souscrire
  MAX_AGE: 75,               // Âge maximum pour souscrire
  MAX_CHILDREN: 5,           // Nombre maximum d'enfants
  EMAIL_MAX_LENGTH: 254,     // Longueur maximum email
  PHONE_LENGTH: 10,          // Longueur numéro français
  NAME_MIN_LENGTH: 2,        // Longueur minimum nom/prénom
  NAME_MAX_LENGTH: 50        // Longueur maximum nom/prénom
} as const

// Messages d'erreur par défaut
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Ce champ est obligatoire',
  INVALID_EMAIL: 'Adresse email invalide',
  INVALID_PHONE: 'Numéro de téléphone invalide',
  MIN_INCOME: `Revenu minimum ${VALIDATION_LIMITS.MIN_INCOME}€/mois`,
  MAX_INCOME: `Revenu maximum ${VALIDATION_LIMITS.MAX_INCOME}€/mois`,
  GENERIC_ERROR: 'Une erreur est survenue. Veuillez réessayer.',
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  SERVER_ERROR: 'Erreur serveur. Nous travaillons à la résoudre.'
} as const

// Configuration des notifications
export const NOTIFICATION_DURATION = {
  SUCCESS: 4000,    // 4 secondes
  ERROR: 6000,      // 6 secondes
  WARNING: 5000,    // 5 secondes
  INFO: 3000        // 3 secondes
} as const

// URLs externes importantes
export const EXTERNAL_URLS = {
  AMELI: 'https://www.ameli.fr',
  ACPR: 'https://acpr.banque-france.fr',
  CNIL: 'https://www.cnil.fr',
  SOCIAL_SECURITY: 'https://www.securite-sociale.fr',
  HEALTH_MINISTRY: 'https://solidarites-sante.gouv.fr'
} as const

// Configuration des cookies et tracking
export const TRACKING_CONFIG = {
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GA_ID || '',
  HOTJAR_ID: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
  COOKIE_CONSENT_DURATION: 365, // jours
  SESSION_TIMEOUT: 30 * 60 * 1000 // 30 minutes en ms
} as const

// Configuration SEO
export const SEO_CONFIG = {
  SITE_NAME: 'Solenna',
  SITE_DESCRIPTION: 'La première e-mutuelle solidaire pour les maladies chroniques. Plus jamais d\'avance de frais pour l\'endométriose, diabète, maladies cardiovasculaires.',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://solenna.fr',
  TWITTER_HANDLE: '@solenna_mutuelle',
  DEFAULT_IMAGE: '/og-image.jpg',
  KEYWORDS: [
    'mutuelle',
    'santé', 
    'endométriose',
    'maladies chroniques',
    'diabète',
    'cardiovasculaire',
    'cancer',
    'assurance santé',
    'complémentaire santé',
    'tiers payant'
  ]
} as const