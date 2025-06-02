/*
  Fichier: src/lib/utils.ts
  Fonctions utilitaires pour l'application Solena
  Gestion des classes CSS, formatage des prix, calculs métier
*/

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Fonction utilitaire pour combiner les classes CSS avec Tailwind
 * Utilise clsx pour la logique conditionnelle et twMerge pour éviter les conflits
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate un prix en euros selon la locale
 * @param price - Le prix à formater
 * @param locale - La locale à utiliser (défaut: fr-FR)
 * @returns Le prix formaté avec le symbole €
 */
export function formatPrice(price: number, locale: string = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0, // Pas de décimales pour les prix
  }).format(price)
}

/**
 * Formate un nombre avec des séparateurs de milliers
 * @param number - Le nombre à formater
 * @param locale - La locale à utiliser
 * @returns Le nombre formaté
 */
export function formatNumber(number: number, locale: string = 'fr-FR'): string {
  return new Intl.NumberFormat(locale).format(number)
}

/**
 * Calcule la cotisation selon les revenus et la présence d'une pathologie chronique
 * Logique métier principale de Solena
 * @param income - Revenus mensuels nets en euros
 * @param hasChronicCondition - Présence d'une pathologie chronique
 * @returns Le montant de la cotisation mensuelle
 */
export function calculatePremium(income: number, hasChronicCondition: boolean = false): number {
  // Grille tarifaire de base selon les revenus
  let basePremium: number
  
  if (income < 1500) {
    basePremium = 60    // Tarif solidaire pour revenus modestes
  } else if (income < 3000) {
    basePremium = 95    // Tarif intermédiaire
  } else if (income < 5000) {
    basePremium = 130   // Tarif standard
  } else {
    basePremium = 165   // Tarif premium pour hauts revenus
  }
  
  // Ajout du pack pathologie chronique
  if (hasChronicCondition) {
    basePremium += 25   // Supplément pour couverture spécialisée
  }
  
  return basePremium
}

/**
 * Calcule les économies annuelles pour une pathologie chronique
 * @param pathology - Type de pathologie
 * @param income - Revenus pour calculer la cotisation
 * @returns Objet avec cotisation annuelle et économies potentielles
 */
export function calculateSavings(pathology: string, income: number) {
  const monthlyPremium = calculatePremium(income, true)
  const annualPremium = monthlyPremium * 12
  
  // Économies potentielles selon la pathologie
  const savings = {
    endometriosis: 15000,     // Chirurgies + PMA
    cardiovascular: 12000,    // Cardiologie + rééducation
    diabetes: 8000,          // Matériel + suivi
    cancer: 20000,           // Oncologie + chimio
    mentalHealth: 6000,      // Psychothérapie
    chronic: 10000           // Autres pathologies chroniques
  }
  
  const potentialSavings = savings[pathology as keyof typeof savings] || 0
  const netSavings = potentialSavings - annualPremium
  
  return {
    monthlyPremium,
    annualPremium,
    potentialSavings,
    netSavings: Math.max(0, netSavings), // Ne peut pas être négatif
    savingsRatio: potentialSavings > 0 ? (netSavings / potentialSavings) * 100 : 0
  }
}

/**
 * Vérifie si une chaîne est un email valide
 * @param email - L'email à valider
 * @returns true si l'email est valide
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Vérifie si un numéro de téléphone français est valide
 * @param phone - Le numéro à valider
 * @returns true si le numéro est valide
 */
export function isValidFrenchPhone(phone: string): boolean {
  // Regex pour numéros français (06, 07, 01-05, 09)
  const phoneRegex = /^(?:(?:\+33|0)[1-9])(?:[0-9]{8})$/
  const cleanPhone = phone.replace(/[\s\-\.]/g, '') // Retirer espaces, tirets, points
  return phoneRegex.test(cleanPhone)
}

/**
 * Formate un numéro de téléphone français
 * @param phone - Le numéro à formater
 * @returns Le numéro formaté (XX XX XX XX XX)
 */
export function formatFrenchPhone(phone: string): string {
  const cleanPhone = phone.replace(/[\s\-\.]/g, '')
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
  }
  return phone
}

/**
 * Génère un slug URL-friendly à partir d'une chaîne
 * @param text - Le texte à convertir
 * @returns Le slug généré
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[àáâäã]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôöõ]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '') // Retirer caractères spéciaux
    .replace(/\s+/g, '-')         // Remplacer espaces par tirets
    .replace(/-+/g, '-')          // Éviter tirets multiples
    .replace(/^-|-$/g, '')        // Retirer tirets en début/fin
}

/**
 * Calcule l'âge à partir d'une date de naissance
 * @param birthDate - Date de naissance
 * @returns L'âge en années
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  
  // Vérifier si l'anniversaire est passé cette année
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

/**
 * Débounce une fonction pour limiter les appels répétés
 * Utile pour les champs de recherche ou les API calls
 * @param func - La fonction à debouncer
 * @param wait - Délai d'attente en ms
 * @returns La fonction debouncée
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Simule une pause asynchrone
 * Utile pour les tests ou les animations
 * @param ms - Durée en millisecondes
 * @returns Promise qui se résout après le délai
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Détecte le type d'appareil
 * @returns Le type d'appareil détecté
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

/**
 * Copie du texte dans le presse-papiers
 * @param text - Texte à copier
 * @returns Promise qui se résout quand la copie est effectuée
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false
  
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback pour les navigateurs plus anciens
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    const result = document.execCommand('copy')
    document.body.removeChild(textArea)
    return result
  }
}