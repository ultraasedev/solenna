/*
  Fichier: src/components/sections/SimulatorSection.tsx
  Simulateur interactif complet pour calculer la cotisation personnalisée
  Utilise GSAP pour les animations et React hooks pour la logique métier
*/

'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Calculator, Euro, Users, Heart, TrendingUp, Shield, Star, CheckCircle } from 'lucide-react'
import { useSimulator } from '@/hooks/useSimulator'
import { formatPrice } from '@/lib/utils'

// Enregistrement du plugin ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function SimulatorSection() {
  // Références pour les animations
  const sectionRef = useRef<HTMLElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  
  // Hook pour les traductions
  const t = useTranslations('simulator')

  // Hook du simulateur avec toute la logique métier
  const {
    data,
    result,
    isCalculating,
    errors,
    isValid,
    updateField,
    getRecommendedTier,
    getEstimatedSavings
  } = useSimulator({
    autoCalculate: true,
    debounceMs: 300,
    persistState: true
  })

  // Liste des pathologies pour le select
  const pathologies = [
    { value: 'none', label: t('pathology.none'), emoji: '🚫' },
    { value: 'endometriosis', label: t('pathology.endometriosis'), emoji: '🌸' },
    { value: 'cardiovascular', label: t('pathology.cardiovascular'), emoji: '❤️' },
    { value: 'diabetes', label: t('pathology.diabetes'), emoji: '🩺' },
    { value: 'cancer', label: t('pathology.cancer'), emoji: '🎗️' },
    { value: 'mentalHealth', label: t('pathology.mentalHealth'), emoji: '🧠' },
    { value: 'other', label: t('pathology.other'), emoji: '🏥' }
  ]

  // Animations GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation d'entrée de la section
      gsap.fromTo('.simulator-container',
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Animation des champs de formulaire
      gsap.utils.toArray('.form-field').forEach((field, index) => {
        gsap.fromTo(field as HTMLElement,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: index * 0.1 + 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: field as HTMLElement,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Animation du résultat quand il change
  useEffect(() => {
    if (result && resultRef.current) {
      gsap.fromTo(resultRef.current,
        { opacity: 0, scale: 0.8, y: 30 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)'
        }
      )
    }
  }, [result])

  // Fonction pour scroll vers les tarifs
  const scrollToPricing = () => {
    document.querySelector('#pricing')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <section 
      ref={sectionRef}
      id="simulator" 
      className="py-20 bg-gradient-to-br from-solena-50 via-white to-solena-100 relative overflow-hidden"
    >
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-10 w-72 h-72 bg-solena-pink-light rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-solena-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-solena-pink rounded-2xl mb-6">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Container du simulateur */}
        <div className="simulator-container max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              
              {/* Formulaire du simulateur */}
              <div className="p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                  <Users className="w-6 h-6 text-solena-pink mr-3" />
                  Vos informations
                </h3>

                <div className="space-y-8">
                  {/* Revenus mensuels */}
                  <div className="form-field">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {t('income.label')}
                    </label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="range"
                        min="1000"
                        max="8000"
                        step="100"
                        value={data.income}
                        onChange={(e) => updateField('income', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider mb-4"
                        style={{
                          background: `linear-gradient(to right, #FFE4E6 0%, #FF69B4 ${((data.income - 1000) / 7000) * 100}%, #E5E7EB ${((data.income - 1000) / 7000) * 100}%, #E5E7EB 100%)`
                        }}
                      />
                      <div className="flex justify-between text-sm text-gray-500 mb-3">
                        <span>1 000€</span>
                        <span className="font-bold text-solena-pink text-lg">
                          {formatPrice(data.income)}
                        </span>
                        <span>8 000€</span>
                      </div>
                      {errors.income && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <span className="w-4 h-4 text-red-500 mr-1">⚠️</span>
                          {errors.income}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Situation familiale */}
                  <div className="form-field">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {t('family.label')}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'single', label: t('family.single'), icon: '👤', price: '+0€' },
                        { value: 'couple', label: t('family.couple'), icon: '👥', price: '+40€' },
                        { value: 'family', label: t('family.family'), icon: '👨‍👩‍👧‍👦', price: '+65€' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateField('familyStatus', option.value as any)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 relative ${
                            data.familyStatus === option.value
                              ? 'border-solena-pink bg-solena-50 text-solena-pink shadow-lg'
                              : 'border-gray-200 hover:border-solena-pink-light hover:shadow-md'
                          }`}
                        >
                          <div className="text-2xl mb-2">{option.icon}</div>
                          <div className="text-sm font-medium mb-1">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.price}</div>
                          {data.familyStatus === option.value && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-solena-pink rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.familyStatus && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="w-4 h-4 text-red-500 mr-1">⚠️</span>
                        {errors.familyStatus}
                      </p>
                    )}
                  </div>

                  {/* Pathologie chronique */}
                  <div className="form-field">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Heart className="inline w-4 h-4 text-solena-pink mr-2" />
                      {t('pathology.label')}
                    </label>
                    <select
                      value={data.pathology}
                      onChange={(e) => updateField('pathology', e.target.value as any)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-solena-pink focus:ring-0 transition-colors duration-300 bg-white"
                    >
                      {pathologies.map((pathology) => (
                        <option key={pathology.value} value={pathology.value}>
                          {pathology.emoji} {pathology.label}
                        </option>
                      ))}
                    </select>
                    {data.hasChronicCondition && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-700 text-sm">
                          ✨ Pack spécialisé +25€/mois inclus pour votre pathologie
                        </p>
                      </div>
                    )}
                    {errors.pathology && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="w-4 h-4 text-red-500 mr-1">⚠️</span>
                        {errors.pathology}
                      </p>
                    )}
                  </div>

                  {/* Recommandation de formule */}
                  {isValid && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-blue-800">Formule recommandée</span>
                      </div>
                      <p className="text-blue-700 text-sm">
                        Selon vos revenus ({formatPrice(data.income)}), nous vous recommandons la formule{' '}
                        <span className="font-bold capitalize bg-blue-100 px-2 py-1 rounded">
                          {getRecommendedTier()}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Résultat du calcul */}
              <div className="bg-gradient-to-br from-solena-pink to-solena-600 p-8 lg:p-12 text-white flex flex-col justify-center">
                {isCalculating ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-lg">Calcul en cours...</p>
                  </div>
                ) : result ? (
                  <div ref={resultRef} className="text-center">
                    <h3 className="text-2xl font-bold mb-6">
                      {t('result.title')}
                    </h3>
                    
                    {/* Prix principal */}
                    <div className="mb-8">
                      <div className="text-6xl font-bold mb-2">
                        {formatPrice(result.totalPremium)}
                      </div>
                      <div className="text-xl opacity-90">
                        {t('result.period')}
                      </div>
                      
                      {/* Détail du calcul */}
                      {(result.familySupplement > 0 || result.pathologySupplement > 0) && (
                        <div className="mt-4 text-sm opacity-80 space-y-1">
                          <div className="flex justify-between">
                            <span>Base:</span>
                            <span>{formatPrice(result.monthlyPremium)}</span>
                          </div>
                          {result.familySupplement > 0 && (
                            <div className="flex justify-between">
                              <span>Famille:</span>
                              <span>+{formatPrice(result.familySupplement)}</span>
                            </div>
                          )}
                          {result.pathologySupplement > 0 && (
                            <div className="flex justify-between">
                              <span>Pathologie:</span>
                              <span>+{formatPrice(result.pathologySupplement)}</span>
                            </div>
                          )}
                          <div className="border-t border-white/20 pt-1 flex justify-between font-bold">
                            <span>Total:</span>
                            <span>{formatPrice(result.totalPremium)}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Détails inclus */}
                    <div className="bg-white/10 rounded-2xl p-6 mb-8">
                      <p className="text-lg font-medium mb-4">
                        {t('result.includes')}
                      </p>
                      <div className="space-y-2 text-sm opacity-90">
                        {result.coverageDetails.map((detail, index) => (
                          <div key={index} className="flex items-center text-left">
                            <CheckCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Informations sur les économies potentielles */}
                    {data.hasChronicCondition && result.potentialSavings && getEstimatedSavings() > 0 && (
                      <div className="mb-6 p-4 bg-white/10 rounded-xl">
                        <h4 className="font-semibold mb-2 flex items-center justify-center">
                          <Shield className="w-5 h-5 mr-2" />
                          💰 Économies estimées
                        </h4>
                        <p className="text-sm opacity-90">
                          Avec votre pathologie chronique, vous pourriez économiser jusqu'à{' '}
                          <span className="font-bold text-lg">
                            {formatPrice(getEstimatedSavings())}
                          </span>
                          {' '}par an par rapport aux frais habituels.
                        </p>
                        <div className="mt-2 text-xs opacity-75">
                          Soit {Math.round(getEstimatedSavings() / result.totalPremium)} mois de cotisation gratuits !
                        </div>
                      </div>
                    )}

                    {/* Bouton CTA */}
                    <button
                      onClick={scrollToPricing}
                      className="w-full bg-white text-solena-pink font-bold py-4 px-8 rounded-xl hover:bg-gray-50 transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      {t('result.cta')}
                      <Star className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center opacity-70">
                    <Calculator className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg">Remplissez le formulaire pour voir votre cotisation</p>
                    <p className="text-sm opacity-75 mt-2">Calcul instantané et gratuit</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Sans engagement</h4>
              <p className="text-sm text-gray-600">Résiliable à tout moment sans frais ni pénalité</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Euro className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Tarif solidaire</h4>
              <p className="text-sm text-gray-600">Prix selon vos revenus réels, pas de tarif unique</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Effet immédiat</h4>
              <p className="text-sm text-gray-600">Couverture dès la souscription, sans délai de carence</p>
            </div>
          </div>

          {/* Section témoignages */}
          <div className="mt-16 bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              🌟 Ils ont choisi Solena
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-solena-pink to-solena-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <p className="text-gray-600 italic mb-4 leading-relaxed">
                  "Grâce à Solena, je n'ai plus à avancer 3000€ pour mes chirurgies d'endométriose. 
                  Un vrai soulagement financier et un accompagnement formidable !"
                </p>
                <div className="font-semibold text-gray-800">Marie, 29 ans</div>
                <div className="text-sm text-gray-500">Endométriose stade 4</div>
                <div className="flex justify-center mt-2">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-1">Adhérente depuis 2 ans</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <p className="text-gray-600 italic mb-4 leading-relaxed">
                  "Après mon infarctus, Solena a pris en charge toute ma rééducation cardiaque. 
                  Leur accompagnement est exceptionnel, je me sens vraiment soutenu."
                </p>
                <div className="font-semibold text-gray-800">Pierre, 54 ans</div>
                <div className="text-sm text-gray-500">Pathologie cardiovasculaire</div>
                <div className="flex justify-center mt-2">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-1">Adhérent depuis 3 ans</div>
              </div>
            </div>
            
            {/* Statistiques de satisfaction */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-solena-pink">4.8/5</div>
                <div className="text-xs text-gray-500">Satisfaction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-solena-pink">95%</div>
                <div className="text-xs text-gray-500">Recommandent</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-solena-pink">10K+</div>
                <div className="text-xs text-gray-500">Adhérents</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-solena-pink">48h</div>
                <div className="text-xs text-gray-500">Remboursement</div>
              </div>
            </div>
          </div>

          {/* Section FAQ rapide */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              ❓ Questions fréquentes
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-6 h-6 bg-solena-pink text-white rounded-full flex items-center justify-center text-sm mr-3">?</span>
                  Comment fonctionne le 100% santé ?
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Avec Solena, vous n'avancez jamais les frais pour vos soins liés à votre maladie chronique. 
                  Nous payons directement les professionnels de santé partenaires grâce au tiers payant généralisé.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-6 h-6 bg-solena-pink text-white rounded-full flex items-center justify-center text-sm mr-3">?</span>
                  Puis-je changer de formule ?
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Oui, vous pouvez upgrader votre formule à tout moment ou downgrader à la prochaine échéance. 
                  Aucun frais de modification, votre nouveau tarif s'applique immédiatement.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-6 h-6 bg-solena-pink text-white rounded-full flex items-center justify-center text-sm mr-3">?</span>
                  Les maladies préexistantes sont-elles couvertes ?
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Contrairement aux mutuelles classiques, Solena ne pratique aucune exclusion pour les maladies préexistantes. 
                  C'est notre mission : aider ceux qui en ont le plus besoin !
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-6 h-6 bg-solena-pink text-white rounded-full flex items-center justify-center text-sm mr-3">?</span>
                  Combien de temps pour être remboursé ?
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Avec le tiers payant généralisé, vous n'attendez pas de remboursement ! 
                  Pour les autres frais exceptionnels, maximum 48h après réception des justificatifs.
                </p>
              </div>
            </div>
          </div>

          {/* CTA final avec urgence */}
          <div className="mt-16 bg-gradient-to-r from-solena-pink to-solena-600 rounded-3xl p-8 text-white text-center relative overflow-hidden">
            {/* Éléments décoratifs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-12 translate-y-12"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">
                🚀 Prêt à rejoindre Solena ?
              </h3>
              <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto leading-relaxed">
                Plus de 10 000 personnes ont déjà choisi Solena pour leurs maladies chroniques. 
                Ne laissez plus les frais de santé impacter votre quotidien et votre famille.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <button
                  onClick={scrollToPricing}
                  className="bg-white text-solena-pink font-bold py-4 px-8 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
                >
                  Voir les formules détaillées
                  <Star className="w-5 h-5 ml-2" />
                </button>
                
                <div className="text-sm opacity-80 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Première consultation gratuite avec un conseiller santé
                </div>
              </div>
              
              {/* Indicateurs de confiance */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-80">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Agrément ACPR
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2">🔒</span>
                  Données sécurisées HDS
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2">⭐</span>
                  4.8/5 satisfaction client
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2">💚</span>
                  Impact social positif certifié
                </div>
              </div>

              {/* Offre limitée */}
              <div className="mt-6 bg-white/10 rounded-xl p-4 max-w-md mx-auto">
                <div className="text-sm font-semibold mb-1">🎁 Offre de lancement</div>
                <div className="text-xs opacity-90">
                  Premier mois offert pour toute souscription avant fin décembre 2024
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles pour le slider personnalisé */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FF69B4;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(255, 105, 180, 0.4);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(255, 105, 180, 0.6);
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FF69B4;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(255, 105, 180, 0.4);
        }
        
        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
        }
        
        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          border: none;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @media (max-width: 768px) {
          .simulator-container .grid {
            grid-template-columns: 1fr;
          }
          
          .text-6xl {
            font-size: 3rem;
          }
        }
      `}</style>
    </section>
  )
}