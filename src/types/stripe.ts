/*
  Fichier: src/types/stripe.ts
  Types spécifiques à l'intégration Stripe pour Solena
*/

import Stripe from 'stripe'
import { TierId } from './pricing'
import { PathologyId } from './pathologies'

// Configuration Stripe
export interface StripeConfig {
  publishableKey: string
  secretKey: string
  webhookSecret: string
  apiVersion: string
  currency: 'eur'
  country: 'FR'
  mode: 'test' | 'live'
}

// Produits Stripe configurés
export interface StripeProduct {
  id: string
  name: string
  description: string
  tier: TierId
  priceId: string
  price: number
  currency: 'eur'
  interval: 'month' | 'year'
  active: boolean
  metadata: {
    tier: TierId
    pathologies?: PathologyId[]
    familyPlan?: boolean
  }
}

// Session de checkout Stripe
export interface StripeCheckoutSession {
  sessionId: string
  url: string
  customer: {
    id?: string
    email: string
    name: string
    phone?: string
  }
  subscription: {
    tierId: TierId
    priceId: string
    trialPeriodDays?: number
    metadata: Record<string, string>
  }
  successUrl: string
  cancelUrl: string
  allowPromotionCodes: boolean
  billingAddressCollection: 'auto' | 'required'
  shippingAddressCollection?: {
    allowedCountries: string[]
  }
}

// Abonnement Stripe
export interface StripeSubscription {
  id: string
  customerId: string
  status: 'active' | 'past_due' | 'unpaid' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing'
  tier: TierId
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  canceledAt?: Date
  trialStart?: Date
  trialEnd?: Date
  items: StripeSubscriptionItem[]
  metadata: {
    userId: string
    tier: TierId
    pathologies: string
    familyMembers: string
  }
  billing: {
    amount: number
    currency: 'eur'
    interval: 'month' | 'year'
    nextPaymentDate: Date
  }
}

// Item d'abonnement Stripe
export interface StripeSubscriptionItem {
  id: string
  priceId: string
  quantity: number
  product: {
    id: string
    name: string
    description: string
  }
  metadata: Record<string, string>
}

// Client Stripe
export interface StripeCustomer {
  id: string
  email: string
  name: string
  phone?: string
  address?: Stripe.Address
  defaultPaymentMethod?: string
  invoiceSettings: {
    defaultPaymentMethod?: string
    customFields?: Stripe.Invoice.CustomField[]
  }
  metadata: {
    userId: string
    registrationDate: string
    tier: TierId
  }
  subscription?: StripeSubscription
  balance: number
  currency: 'eur'
  taxExempt: 'none' | 'exempt' | 'reverse'
}

// Méthode de paiement Stripe
export interface StripePaymentMethod {
  id: string
  type: 'card' | 'sepa_debit' | 'ideal' | 'bancontact'
  card?: {
    brand: string
    last4: string
    expMonth: number
    expYear: number
    country: string
  }
  sepaDebit?: {
    country: string
    bankCode: string
    last4: string
  }
  billingDetails: {
    name: string
    email: string
    phone?: string
    address?: Stripe.Address
  }
  created: Date
  customer: string
}

// Facture Stripe
export interface StripeInvoice {
  id: string
  customerId: string
  subscriptionId?: string
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
  amount: number
  amountPaid: number
  amountRemaining: number
  currency: 'eur'
  dueDate?: Date
  paidAt?: Date
  hostedInvoiceUrl: string
  invoicePdf: string
  lines: StripeInvoiceLineItem[]
  billing: {
    period: {
      start: Date
      end: Date
    }
    reason: 'subscription_cycle' | 'subscription_create' | 'subscription_update' | 'upcoming' | 'manual'
  }
}

// Ligne de facture Stripe
export interface StripeInvoiceLineItem {
  id: string
  description: string
  amount: number
  currency: 'eur'
  quantity: number
  priceId?: string
  subscriptionId?: string
  period: {
    start: Date
    end: Date
  }
  metadata: Record<string, string>
}

// Événement webhook Stripe
export interface StripeWebhookEvent {
  id: string
  type: StripeWebhookEventType
  data: {
    object: any
    previousAttributes?: any
  }
  created: Date
  livemode: boolean
  pendingWebhooks: number
  request?: {
    id: string
    idempotencyKey?: string
  }
}

// Types d'événements webhook
export type StripeWebhookEventType =
  | 'customer.created'
  | 'customer.updated'
  | 'customer.deleted'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'customer.subscription.trial_will_end'
  | 'invoice.created'
  | 'invoice.finalized'
  | 'invoice.paid'
  | 'invoice.payment_failed'
  | 'payment_method.attached'
  | 'payment_method.detached'
  | 'checkout.session.completed'
  | 'checkout.session.expired'

// Gestion des webhooks
export interface StripeWebhookHandler {
  event: StripeWebhookEventType
  handler: (event: StripeWebhookEvent) => Promise<void>
  description: string
  critical: boolean
}

// Métriques Stripe
export interface StripeMetrics {
  revenue: {
    mrr: number // Monthly Recurring Revenue
    arr: number // Annual Recurring Revenue
    growth: {
      monthly: number
      quarterly: number
      yearly: number
    }
  }
  subscriptions: {
    total: number
    active: number
    trialing: number
    pastDue: number
    canceled: number
    byTier: {
      [K in TierId]: number
    }
  }
  customers: {
    total: number
    new: number
    churned: number
    ltv: number // Lifetime Value
  }
  payments: {
    successful: number
    failed: number
    disputed: number
    refunded: number
    failureReasons: {
      [reason: string]: number
    }
  }
  conversion: {
    checkoutToSubscription: number
    trialToActive: number
    freeToActive: number
  }
}

// Configuration des prix Stripe
export interface StripePriceConfig {
  productId: string
  unitAmount: number
  currency: 'eur'
  recurring: {
    interval: 'month' | 'year'
    intervalCount: 1
    usageType: 'licensed'
  }
  metadata: {
    tier: TierId
    pathologies?: string
    familyPlan?: string
  }
  active: boolean
  nickname?: string
}

// Gestion des erreurs Stripe
export interface StripeError {
  type: 'api_error' | 'card_error' | 'idempotency_error' | 'invalid_request_error' | 'rate_limit_error' | 'authentication_error' | 'api_connection_error'
  code?: string
  message: string
  param?: string
  statusCode?: number
  requestId?: string
  charge?: string
  decline_code?: string
  payment_method?: {
    id: string
    type: string
  }
}

// Retry logic pour Stripe
export interface StripeRetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  retryableErrors: string[]
  exponentialBackoff: boolean
}

// Tests Stripe
export interface StripeTestCard {
  number: string
  cvc: string
  expMonth: number
  expYear: number
  purpose: string
  expectedOutcome: 'success' | 'failure'
  description: string
}

// Configuration complète Stripe
export interface StripeSetup {
  config: StripeConfig
  products: StripeProduct[]
  webhookHandlers: StripeWebhookHandler[]
  testCards: StripeTestCard[]
  retryConfig: StripeRetryConfig
  monitoring: {
    alertThresholds: {
      failureRate: number
      responseTime: number
      errorCount: number
    }
    dashboards: string[]
  }
}

// Export des utilitaires
export type StripeEventData<T extends StripeWebhookEventType> = 
  T extends 'customer.subscription.created' ? Stripe.Subscription :
  T extends 'customer.subscription.updated' ? Stripe.Subscription :
  T extends 'customer.subscription.deleted' ? Stripe.Subscription :
  T extends 'invoice.created' ? Stripe.Invoice :
  T extends 'invoice.paid' ? Stripe.Invoice :
  T extends 'invoice.payment_failed' ? Stripe.Invoice :
  T extends 'checkout.session.completed' ? Stripe.Checkout.Session :
  T extends 'customer.created' ? Stripe.Customer :
  T extends 'customer.updated' ? Stripe.Customer :
  any

// Types pour les réponses API Solena-Stripe
export interface SolenaStripeResponse<T = any> {
  success: boolean
  data?: T
  error?: StripeError
  message?: string
  requestId?: string
}

// Configuration des produits Solena dans Stripe
export const SOLENA_STRIPE_PRODUCTS = {
  ESSENTIAL_MONTHLY: {
    priceId: 'price_essential_monthly',
    productId: 'prod_essential',
    amount: 6000, // 60€ en centimes
    interval: 'month'
  },
  COMFORT_MONTHLY: {
    priceId: 'price_comfort_monthly', 
    productId: 'prod_comfort',
    amount: 9500, // 95€ en centimes
    interval: 'month'
  },
  PREMIUM_MONTHLY: {
    priceId: 'price_premium_monthly',
    productId: 'prod_premium', 
    amount: 16500, // 165€ en centimes
    interval: 'month'
  }
} as const