/*
  Fichier: src/hooks/useSimulator.ts
  Hook personnalisé pour gérer la logique du simulateur de cotisation
*/

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { calculatePremium, formatPrice } from '@/lib/utils'
import { FAMILY_SUPPLEMENTS, CHRONIC_PACK_PRICE, COVERAGE_AMOUNTS } from '@/lib/constants'
import type { SimulatorData, SimulatorResult } from '@/types'
import type { PathologyId } from '@/types/pathologies'

// Type pour les statuts familiaux
type FamilyStatusType = 'single' | 'couple' | 'family'

interface UseSimulatorOptions {
  autoCalculate?: boolean
  debounceMs?: number
  persistState?: boolean
  storageKey?: string
}

interface UseSimulatorReturn {
  data: SimulatorData
  result: SimulatorResult | null
  isCalculating: boolean
  errors: Record<string, string>
  isValid: boolean
  updateField: <K extends keyof SimulatorData>(field: K, value: SimulatorData[K]) => void
  calculate: () => Promise<SimulatorResult>
  reset: () => void
  validateField: (field: keyof SimulatorData) => string | null
  validateAll: () => boolean
  getRecommendedTier: () => 'essential' | 'comfort' | 'premium'
  getEstimatedSavings: () => number
  exportData: () => string
  importData: (data: string) => boolean
}

const defaultData: SimulatorData = {
  income: 2500,
  familyStatus: 'single',
  pathology: 'none',
  hasChronicCondition: false
}

export function useSimulator(options: UseSimulatorOptions = {}): UseSimulatorReturn {
  const {
    autoCalculate = true,
    debounceMs = 500,
    persistState = true,
    storageKey = 'solena-simulator'
  } = options

  // États du simulateur
  const [data, setData] = useState<SimulatorData>(defaultData)
  const [result, setResult] = useState<SimulatorResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Charger les données depuis le localStorage au montage
  useEffect(() => {
    if (persistState && typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try {
          const parsedData = JSON.parse(stored)
          setData({ ...defaultData, ...parsedData })
        } catch (error) {
          console.warn('Erreur lors du chargement des données du simulateur:', error)
        }
      }
    }
  }, [persistState, storageKey])

  // Sauvegarder les données dans le localStorage
  useEffect(() => {
    if (persistState && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(data))
    }
  }, [data, persistState, storageKey])

  // Validation des champs
  const validateField = useCallback((field: keyof SimulatorData): string | null => {
    const value = data[field]

    switch (field) {
      case 'income':
        if (typeof value !== 'number' || value < 500) {
          return 'Le revenu doit être d\'au moins 500€/mois'
        }
        if (value > 15000) {
          return 'Le revenu ne peut pas dépasser 15 000€/mois'
        }
        break

      case 'familyStatus':
        if (!['single', 'couple', 'family'].includes(value as string)) {
          return 'Situation familiale invalide'
        }
        break

      case 'pathology':
        const validPathologies = ['none', 'endometriosis', 'cardiovascular', 'diabetes', 'cancer', 'mentalHealth', 'other']
        if (!validPathologies.includes(value as string)) {
          return 'Pathologie invalide'
        }
        break

      default:
        break
    }

    return null
  }, [data])

  // Validation complète
  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    Object.keys(data).forEach((field) => {
      const error = validateField(field as keyof SimulatorData)
      if (error) {
        newErrors[field] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [data, validateField])

  // Vérifier si les données sont valides
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && 
           data.income >= 500 && 
           data.income <= 15000
  }, [errors, data.income])

  // Calculer la cotisation
  const calculate = useCallback(async (): Promise<SimulatorResult> => {
    setIsCalculating(true)

    // Simuler un délai pour l'expérience utilisateur
    await new Promise(resolve => setTimeout(resolve, 300))

    try {
      // Calcul de la cotisation de base
      const basePremium = calculatePremium(data.income, data.hasChronicCondition)
      
      // Suppléments familiaux
      const familySupplement = FAMILY_SUPPLEMENTS[data.familyStatus as keyof typeof FAMILY_SUPPLEMENTS]
      
      // Supplément pathologie chronique
      const pathologySupplement = data.hasChronicCondition ? CHRONIC_PACK_PRICE : 0
      
      // Total mensuel
      const monthlyPremium = basePremium + familySupplement + pathologySupplement
      const annualPremium = monthlyPremium * 12

      // Économies potentielles si pathologie chronique
      let potentialSavings = 0
      if (data.hasChronicCondition && data.pathology !== 'none') {
        potentialSavings = COVERAGE_AMOUNTS[data.pathology as PathologyId] || 0
      }

      // Détails de couverture
      const coverageDetails = [
        'Mutuelle complète (médecin, dentaire, optique)',
        'Téléconsultation 24h/7j incluse',
        'Tiers payant généralisé'
      ]

      if (data.hasChronicCondition) {
        coverageDetails.push('Pack pathologie chronique spécialisé')
      }

      if (data.familyStatus !== 'single') {
        coverageDetails.push('Couverture famille incluse')
      }

      const calculationResult: SimulatorResult = {
        monthlyPremium: basePremium,
        annualPremium,
        familySupplement,
        pathologySupplement,
        totalPremium: monthlyPremium,
        potentialSavings,
        coverageDetails
      }

      setResult(calculationResult)
      return calculationResult

    } catch (error) {
      console.error('Erreur lors du calcul:', error)
      throw new Error('Impossible de calculer la cotisation')
    } finally {
      setIsCalculating(false)
    }
  }, [data])

  // Mettre à jour un champ
  const updateField = useCallback(<K extends keyof SimulatorData>(
    field: K, 
    value: SimulatorData[K]
  ) => {
    setData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Mettre à jour hasChronicCondition automatiquement
      if (field === 'pathology') {
        newData.hasChronicCondition = value !== 'none'
      }
      
      return newData
    })

    // Valider le champ mis à jour
    const error = validateField(field)
    setErrors(prev => {
      const newErrors = { ...prev }
      if (error) {
        newErrors[field] = error
      } else {
        delete newErrors[field]
      }
      return newErrors
    })
  }, [validateField])

  // Calcul automatique avec debounce
  useEffect(() => {
    if (!autoCalculate || !isValid) return

    const timer = setTimeout(() => {
      calculate().catch(console.error)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [data, autoCalculate, isValid, debounceMs, calculate])

  // Réinitialiser le simulateur
  const reset = useCallback(() => {
    setData(defaultData)
    setResult(null)
    setErrors({})
    
    if (persistState && typeof window !== 'undefined') {
      localStorage.removeItem(storageKey)
    }
  }, [persistState, storageKey])

  // Recommander une formule selon les revenus
  const getRecommendedTier = useCallback((): 'essential' | 'comfort' | 'premium' => {
    if (data.income < 1500) {
      return 'essential'
    } else if (data.income < 5000) {
      return 'comfort'
    } else {
      return 'premium'
    }
  }, [data.income])

  // Calculer les économies estimées
  const getEstimatedSavings = useCallback((): number => {
    if (!data.hasChronicCondition || data.pathology === 'none') {
      return 0
    }

    const annualCoverage = COVERAGE_AMOUNTS[data.pathology as PathologyId] || 0
    const annualPremium = result?.annualPremium || 0
    
    return Math.max(0, annualCoverage - annualPremium)
  }, [data, result])

  // Exporter les données
  const exportData = useCallback((): string => {
    const exportObj = {
      data,
      result,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
    return JSON.stringify(exportObj, null, 2)
  }, [data, result])

  // Importer les données
  const importData = useCallback((jsonData: string): boolean => {
    try {
      const imported = JSON.parse(jsonData)
      
      if (imported.data && typeof imported.data === 'object') {
        setData({ ...defaultData, ...imported.data })
        
        if (imported.result) {
          setResult(imported.result)
        }
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Erreur lors de l\'import:', error)
      return false
    }
  }, [])

  return {
    data,
    result,
    isCalculating,
    errors,
    isValid,
    updateField,
    calculate,
    reset,
    validateField,
    validateAll,
    getRecommendedTier,
    getEstimatedSavings,
    exportData,
    importData
  }
}