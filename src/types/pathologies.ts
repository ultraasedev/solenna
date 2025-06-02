/*
  Fichier: src/types/pathologies.ts
  Types spécifiques aux pathologies prises en charge par Solena
*/

import { LucideIcon } from 'lucide-react'

// Types des pathologies supportées
export type PathologyId = 
  | 'endometriosis'
  | 'cardiovascular'
  | 'diabetes'
  | 'cancer'
  | 'mentalHealth'
  | 'chronic'

// Interface complète pour une pathologie
export interface Pathology {
  id: PathologyId
  name: string
  description: string
  shortDescription: string
  coverage: number
  icon: LucideIcon
  color: string
  symptoms: string[]
  treatments: string[]
  specialists: string[]
  estimatedCosts: {
    annual: number
    consultations: number
    medications: number
    procedures: number
    equipment: number
  }
  prevalence: {
    total: number
    women?: number
    men?: number
    ageGroups: {
      '18-30': number
      '31-45': number
      '46-60': number
      '60+': number
    }
  }
}

// Détails spécifiques à l'endométriose
export interface EndometriosisDetails {
  stages: {
    1: { name: string; description: string; coverage: number }
    2: { name: string; description: string; coverage: number }
    3: { name: string; description: string; coverage: number }
    4: { name: string; description: string; coverage: number }
  }
  surgeries: {
    laparoscopy: { cost: number; coverage: number }
    hysterectomy: { cost: number; coverage: number }
    ovariectomy: { cost: number; coverage: number }
  }
  fertility: {
    ivf: { costPerCycle: number; maxCycles: number; coverage: number }
    icsi: { costPerCycle: number; maxCycles: number; coverage: number }
    freezing: { cost: number; coverage: number }
  }
  followUp: {
    gynecologist: { frequency: string; cost: number }
    imaging: { type: string; frequency: string; cost: number }
    psychology: { sessions: number; costPerSession: number }
  }
}

// Détails spécifiques aux maladies cardiovasculaires
export interface CardiovascularDetails {
  conditions: {
    hypertension: { prevalence: number; annualCost: number }
    heartAttack: { prevalence: number; annualCost: number }
    heartFailure: { prevalence: number; annualCost: number }
    arrhythmia: { prevalence: number; annualCost: number }
  }
  prevention: {
    checkups: { frequency: string; cost: number }
    screenings: { tests: string[]; frequency: string; cost: number }
    lifestyle: { programs: string[]; cost: number }
  }
  treatment: {
    medications: { monthly: number; annual: number }
    procedures: { angioplasty: number; bypass: number; pacemaker: number }
    rehabilitation: { duration: string; cost: number }
  }
  monitoring: {
    homeDevices: { cost: number; coverage: number }
    teleconsultations: { frequency: string; cost: number }
    emergencyAccess: { availability: string; cost: number }
  }
}

// Détails spécifiques au diabète
export interface DiabetesDetails {
  types: {
    type1: { prevalence: number; onset: string; management: string }
    type2: { prevalence: number; onset: string; management: string }
    gestational: { prevalence: number; onset: string; management: string }
  }
  monitoring: {
    glucometer: { cost: number; supplies: number }
    cgm: { cost: number; supplies: number; coverage: number }
    strips: { monthly: number; annual: number }
  }
  medications: {
    insulin: { types: string[]; monthlyCost: number }
    oral: { types: string[]; monthlyCost: number }
    injectable: { types: string[]; monthlyCost: number }
  }
  complications: {
    retinopathy: { screening: string; cost: number }
    nephropathy: { screening: string; cost: number }
    neuropathy: { screening: string; cost: number }
    podiatry: { frequency: string; cost: number }
  }
}

// Détails spécifiques au cancer
export interface CancerDetails {
  types: {
    breast: { prevalence: number; fiveYearSurvival: number }
    prostate: { prevalence: number; fiveYearSurvival: number }
    lung: { prevalence: number; fiveYearSurvival: number }
    colorectal: { prevalence: number; fiveYearSurvival: number }
  }
  treatment: {
    surgery: { averageCost: number; coverage: number }
    chemotherapy: { cyclesCost: number; duration: string }
    radiotherapy: { sessionsCost: number; duration: string }
    immunotherapy: { monthlyCost: number; duration: string }
  }
  support: {
    psychology: { sessions: number; costPerSession: number }
    nutrition: { consultations: number; cost: number }
    physiotherapy: { sessions: number; cost: number }
    socialWork: { included: boolean; cost: number }
  }
  followUp: {
    oncologist: { frequency: string; cost: number }
    imaging: { frequency: string; cost: number }
    bloodTests: { frequency: string; cost: number }
    survivorship: { duration: string; cost: number }
  }
}

// Détails spécifiques à la santé mentale
export interface MentalHealthDetails {
  conditions: {
    depression: { prevalence: number; averageDuration: string }
    anxiety: { prevalence: number; averageDuration: string }
    bipolar: { prevalence: number; averageDuration: string }
    ptsd: { prevalence: number; averageDuration: string }
  }
  therapy: {
    individual: { sessionsPerMonth: number; costPerSession: number }
    group: { sessionsPerMonth: number; costPerSession: number }
    family: { sessionsPerMonth: number; costPerSession: number }
    specialized: { types: string[]; costPerSession: number }
  }
  medication: {
    antidepressants: { types: string[]; monthlyCost: number }
    anxiolytics: { types: string[]; monthlyCost: number }
    moodStabilizers: { types: string[]; monthlyCost: number }
    antipsychotics: { types: string[]; monthlyCost: number }
  }
  support: {
    crisisIntervention: { availability: string; cost: number }
    peerSupport: { groups: string[]; cost: number }
    vocationalRehab: { programs: string[]; cost: number }
    housing: { assistance: boolean; cost: number }
  }
}

// Configuration des pathologies avec leurs détails
export interface PathologyConfig {
  pathology: Pathology
  details: EndometriosisDetails | CardiovascularDetails | DiabetesDetails | CancerDetails | MentalHealthDetails
}

// Statistiques par pathologie
export interface PathologyStats {
  totalPatients: number
  averageAge: number
  genderRatio: {
    male: number
    female: number
    other: number
  }
  averageAnnualCost: number
  satisfactionRate: number
  treatmentSuccessRate: number
  qualityOfLifeImprovement: number
}

// Réseau de soins par pathologie
export interface PathologyNetwork {
  specialists: {
    count: number
    averageRating: number
    averageWaitTime: string
    locations: string[]
  }
  facilities: {
    hospitals: number
    clinics: number
    diagnosticCenters: number
    rehabilitationCenters: number
  }
  partnerships: {
    researchInstitutes: string[]
    patientAssociations: string[]
    pharmaceuticalCompanies: string[]
  }
}

// Export des types utilitaires
export type PathologyDetailsType<T extends PathologyId> = 
  T extends 'endometriosis' ? EndometriosisDetails :
  T extends 'cardiovascular' ? CardiovascularDetails :
  T extends 'diabetes' ? DiabetesDetails :
  T extends 'cancer' ? CancerDetails :
  T extends 'mentalHealth' ? MentalHealthDetails :
  never