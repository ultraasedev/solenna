/*
  Fichier: src/types/pricing.ts
  Types spécifiques au système de tarification de Solena
*/

import { PathologyId } from './pathologies'
import { LucideIcon } from 'lucide-react'

// Types des formules disponibles
export type TierId = 'essential' | 'comfort' | 'premium'

// Interface pour une formule de pricing
export interface PricingTier {
  id: TierId
  name: string
  displayName: string
  description: string
  basePrice: number
  currency: 'EUR'
  billing: 'monthly' | 'annual'
  features: PricingFeature[]
  limitations?: PricingLimitation[]
  recommended: boolean
  popular: boolean
  icon: LucideIcon
  color: string
  gradient: string
  maxIncome?: number
  targetAudience: string[]
  savings?: {
    monthly: number
    annual: number
    percentage: number
  }
}

// Fonctionnalité incluse dans une formule
export interface PricingFeature {
  id: string
  name: string
  description: string
  included: boolean
  limit?: number | 'unlimited'
  unit?: string
  details?: string
  category: 'medical' | 'digital' | 'support' | 'admin' | 'chronic'
  icon?: string
}

// Limitation d'une formule
export interface PricingLimitation {
  id: string
  name: string
  description: string
  limit: number
  unit: string
  category: string
}

// Configuration des suppléments
export interface PricingSupplements {
  familySupplements: {
    spouse: {
      name: string
      price: number
      description: string
    }
    children: {
      name: string
      pricePerChild: number
      maxChildren: number
      description: string
    }
  }
  pathologyPacks: {
    [K in PathologyId]: {
      name: string
      price: number
      description: string
      features: string[]
      coverage: number
      specialists: number
    }
  }
  additionalServices: {
    telehealth: {
      name: string
      price: number
      description: string
      features: string[]
    }
    concierge: {
      name: string
      price: number
      description: string
      features: string[]
    }
    coaching: {
      name: string
      price: number
      description: string
      features: string[]
    }
  }
}

// Calcul personnalisé de prix
export interface PricingCalculation {
  baseTier: TierId
  basePrice: number
  supplements: {
    family: {
      spouse: boolean
      children: number
      cost: number
    }
    pathologies: {
      selected: PathologyId[]
      cost: number
    }
    additionalServices: {
      selected: string[]
      cost: number
    }
  }
  discounts: {
    income: {
      bracket: string
      percentage: number
      amount: number
    }
    loyalty: {
      years: number
      percentage: number
      amount: number
    }
    promotional: {
      code?: string
      percentage: number
      amount: number
      validUntil?: Date
    }
  }
  taxes: {
    rate: number
    amount: number
  }
  total: {
    monthly: number
    annual: number
    currency: 'EUR'
  }
  savings: {
    comparedToStandard: number
    comparedToCompetitors: number
    annualSavings: number
  }
}

// Comparaison avec la concurrence
export interface CompetitorComparison {
  competitor: {
    name: string
    logo: string
    marketShare: number
  }
  pricing: {
    basePlan: number
    withChronic: number
    familyPlan: number
  }
  features: {
    coverage: number
    digitalServices: number
    supportQuality: number
    networkSize: number
  }
  advantages: string[]
  disadvantages: string[]
  overallScore: number
}

// Historique des prix
export interface PricingHistory {
  effectiveDate: Date
  changes: {
    tier: TierId
    oldPrice: number
    newPrice: number
    reason: string
    impactedCustomers: number
  }[]
  announcement: {
    date: Date
    notificationSent: boolean
    customerCommunication: string
  }
}

// Politique de remboursement
export interface RefundPolicy {
  eligibility: {
    newCustomers: {
      period: number
      unit: 'days'
      conditions: string[]
    }
    existingCustomers: {
      period: number
      unit: 'days'
      conditions: string[]
    }
  }
  process: {
    requestMethod: string[]
    requiredDocuments: string[]
    processingTime: number
    refundMethod: string[]
  }
  exclusions: string[]
  partialRefunds: {
    conditions: string[]
    calculation: string
  }
}

// Métriques de pricing
export interface PricingMetrics {
  conversion: {
    visitorsToTrial: number
    trialToPaid: number
    tierUpgrade: number
    tierDowngrade: number
  }
  retention: {
    monthly: number
    annual: number
    byTier: {
      [K in TierId]: number
    }
  }
  satisfaction: {
    priceValue: number
    transparency: number
    flexibility: number
    overallScore: number
  }
  churn: {
    overall: number
    reasons: {
      price: number
      features: number
      service: number
      competition: number
      other: number
    }
    byTier: {
      [K in TierId]: number
    }
  }
}

// Configuration de la grille tarifaire
export interface PricingGrid {
  tiers: PricingTier[]
  supplements: PricingSupplements
  comparison: CompetitorComparison[]
  policies: {
    refund: RefundPolicy
    upgrade: {
      immediate: boolean
      prorated: boolean
      restrictions: string[]
    }
    downgrade: {
      nextBilling: boolean
      restrictions: string[]
      retentionOffers: string[]
    }
  }
  promotions: {
    active: boolean
    code?: string
    description: string
    discount: number
    validFrom: Date
    validUntil: Date
    applicableTiers: TierId[]
    restrictions: string[]
  }[]
}

// Simulation de pricing
export interface PricingSimulation {
  input: {
    income: number
    familyStatus: 'single' | 'couple' | 'family'
    pathologies: PathologyId[]
    currentInsurance?: {
      provider: string
      monthlyPremium: number
      coverage: string[]
    }
  }
  output: {
    recommendedTier: TierId
    calculation: PricingCalculation
    comparison: {
      withCurrentInsurance?: number
      withCompetitors: CompetitorComparison[]
    }
    projectedSavings: {
      monthly: number
      annual: number
      fiveYear: number
    }
    nextSteps: string[]
  }
}

// Types pour les webhooks de changement de prix
export interface PricingWebhook {
  event: 'tier_upgrade' | 'tier_downgrade' | 'supplement_added' | 'supplement_removed' | 'price_change'
  timestamp: Date
  customer: {
    id: string
    email: string
    currentTier: TierId
  }
  changes: {
    from: PricingCalculation
    to: PricingCalculation
    effectiveDate: Date
  }
  billing: {
    prorated: boolean
    nextBillingDate: Date
    amountDue: number
  }
}

// Export des types utilitaires
export type TierFeatures<T extends TierId> = 
  T extends 'essential' ? 'basic' :
  T extends 'comfort' ? 'standard' :
  T extends 'premium' ? 'premium' :
  never