/*
  Fichier: src/types/index.ts
  Types TypeScript globaux pour l'application Solena
  Définitions des interfaces et types métier
*/

import { LucideIcon } from 'lucide-react'

// Types pour les pathologies
export type PathologyType = 
  | 'endometriosis'
  | 'cardiovascular'
  | 'diabetes'
  | 'cancer'
  | 'mentalHealth'
  | 'chronic'

export interface Pathology {
  id: PathologyType
  name: string
  description: string
  coverage: number
  icon: LucideIcon
  color: string
}

// Types pour les situations familiales
export type FamilyStatus = 'single' | 'couple' | 'family'

// Types pour les formules de pricing
export interface PricingTier {
  id: string
  name: string
  basePrice: number
  features: string[]
  maxIncome: number
  recommended: boolean
  icon?: LucideIcon
  color?: string
}

// Types pour le simulateur
export interface SimulatorData {
  income: number
  familyStatus: FamilyStatus
  pathology: PathologyType | 'none'
  hasChronicCondition: boolean
}

export interface SimulatorResult {
  monthlyPremium: number
  annualPremium: number
  familySupplement: number
  pathologySupplement: number
  totalPremium: number
  potentialSavings?: number
  coverageDetails: string[]
}

// Types pour les animations GSAP
export interface AnimationConfig {
  duration: number
  delay?: number
  ease?: string
  trigger?: string
  start?: string
  end?: string
  toggleActions?: string
}

export interface ScrollTriggerConfig {
  trigger: string | HTMLElement
  start?: string
  end?: string
  toggleActions?: string
  scrub?: boolean
  pin?: boolean
  markers?: boolean
}

// Types pour les locales
export type Locale = 'fr' | 'en'

// Types pour les formulaires
export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
  pathology?: PathologyType
  consent: boolean
}

export interface SubscriptionFormData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    birthDate: string
    address: {
      street: string
      city: string
      postalCode: string
      country: string
    }
  }
  familyInfo: {
    status: FamilyStatus
    children: number
    spouse?: {
      firstName: string
      lastName: string
      birthDate: string
    }
  }
  healthInfo: {
    pathologies: PathologyType[]
    currentTreatments: string
    medicalHistory: string
  }
  financialInfo: {
    monthlyIncome: number
    selectedTier: string
    paymentMethod: 'monthly' | 'annual'
  }
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface StripeCheckoutResponse {
  sessionId: string
  url: string
}

export interface SubscriptionStatus {
  id: string
  status: 'active' | 'inactive' | 'cancelled' | 'past_due'
  currentPeriodStart: string
  currentPeriodEnd: string
  tier: string
  monthlyAmount: number
}

// Types pour les partenaires médicaux
export interface MedicalPartner {
  id: string
  name: string
  type: 'pharmacy' | 'doctor' | 'specialist' | 'hospital' | 'clinic'
  specialties: string[]
  address: {
    street: string
    city: string
    postalCode: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  contact: {
    phone: string
    email?: string
    website?: string
  }
  services: string[]
  thirdPartyPayment: boolean
  rating: number
  reviews: number
}

// Types pour les notifications
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Types pour les préférences utilisateur
export interface UserPreferences {
  language: Locale
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    reminders: boolean
    newsletter: boolean
  }
  privacy: {
    analytics: boolean
    marketing: boolean
    dataSharing: boolean
  }
  accessibility: {
    reducedMotion: boolean
    highContrast: boolean
    fontSize: 'small' | 'medium' | 'large'
  }
}

// Types pour les statistiques du dashboard
export interface DashboardStats {
  totalMembers: number
  totalCoverage: number
  averageSavings: number
  satisfactionRate: number
  monthlyGrowth: number
  pathologyBreakdown: {
    [key in PathologyType]: number
  }
}

// Types pour les erreurs de validation
export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface FormErrors {
  [fieldName: string]: string | undefined
}

// Types pour les événements analytiques
export interface AnalyticsEvent {
  name: string
  category: string
  properties?: {
    [key: string]: string | number | boolean
  }
  timestamp?: Date
}

// Types pour les témoignages
export interface Testimonial {
  id: string
  name: string
  age: number
  pathology: PathologyType
  message: string
  rating: number
  avatar?: string
  verified: boolean
  date: string
}

// Types pour le contenu éditorial
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  categories: string[]
  tags: string[]
  publishedAt: string
  updatedAt: string
  readingTime: number
  featured: boolean
  pathologyRelated?: PathologyType[]
}

// Types pour les FAQ
export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  pathologyRelated?: PathologyType[]
  helpful: number
  notHelpful: number
}

// Types pour les économies calculées
export interface SavingsCalculation {
  pathology: PathologyType
  annualCosts: {
    withoutSolena: number
    withSolena: number
    savings: number
    savingsPercentage: number
  }
  breakdown: {
    consultations: number
    medications: number
    procedures: number
    hospitalizations: number
    equipment: number
  }
}

// Types pour les webhooks Stripe
export interface StripeWebhookEvent {
  id: string
  type: string
  data: {
    object: any
  }
  created: number
}

// Types pour les métriques de performance
export interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
}

// Export de tous les types utilitaires
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Types pour la gestion d'état
export interface AppState {
  user: {
    isAuthenticated: boolean
    profile?: any
    preferences: UserPreferences
  }
  ui: {
    loading: boolean
    notifications: Notification[]
    theme: 'light' | 'dark' | 'system'
    sidebar: {
      isOpen: boolean
      collapsed: boolean
    }
  }
  simulator: {
    data: SimulatorData
    result?: SimulatorResult
    step: number
    isCalculating: boolean
  }
}

// Types pour les hooks personnalisés
export interface UseAnimationReturn {
  ref: React.RefObject<HTMLElement>
  isVisible: boolean
  animate: (config?: AnimationConfig) => void
}

export interface UseFormReturn<T> {
  values: T
  errors: FormErrors
  touched: { [K in keyof T]: boolean }
  isValid: boolean
  isSubmitting: boolean
  handleChange: (field: keyof T, value: any) => void
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => void
  reset: () => void
  validate: () => boolean
}