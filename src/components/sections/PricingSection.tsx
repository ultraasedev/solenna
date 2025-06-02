/*
  Fichier: src/components/sections/PricingSection.tsx
  Section des tarifs avec 3 formules (Essential, Comfort, Premium)
  Cartes animées avec GSAP et logique de sélection
*/

'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, Star, Crown, Shield } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { PRICING_TIERS } from '@/lib/constants'

// Enregistrement du plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  
  const t = useTranslations('pricing')
  
  // État pour la formule sélectionnée
  const [selectedTier, setSelectedTier] = useState('comfort')

  // Configuration des formules avec icônes
  const tiers = [
    {
      ...PRICING_TIERS.ESSENTIAL,
      icon: Shield,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      ...PRICING_TIERS.COMFORT,
      icon: Star,
      color: 'from-solena-pink to-solena-600'
    },
    {
      ...PRICING_TIERS.PREMIUM,
      icon: Crown,
      color: 'from-purple-500 to-violet-600'
    }
  ]

  // Animations GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation du titre de section
      gsap.fromTo('.pricing-title',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Animation des cartes de pricing
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.pricing-card')
        
        cards.forEach((card, index) => {
          gsap.fromTo(card,
            { 
              opacity: 0, 
              y: 100,
              scale: 0.9,
              rotationY: 10
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationY: 0,
              duration: 0.8,
              delay: index * 0.2,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          )

          // Animation spéciale pour la carte recommandée
          if (card.classList.contains('recommended')) {
            gsap.to(card, {
              scale: 1.05,
              duration: 0.3,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
              }
            })
          }
        })
      }

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Fonction pour sélectionner une formule
  const selectTier = (tierId: string) => {
    setSelectedTier(tierId)
    
    // Animation de sélection
    const card = document.querySelector(`[data-tier="${tierId}"]`)
    if (card) {
      gsap.to(card, {
        scale: 1.02,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      })
    }
  }

  // Fonction pour scroll vers le simulateur
  const scrollToSimulator = () => {
    document.querySelector('#simulator')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <section 
      ref={sectionRef}
      id="pricing" 
      className="py-20 bg-gradient-to-br from-solena-50 via-white to-gray-50 relative overflow-hidden"
    >
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-10 w-72 h-72 bg-solena-pink-light rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-solena-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <h2 className="pricing-title text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Grille des tarifs */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {tiers.map((tier, index) => {
            const IconComponent = tier.icon
            const isRecommended = tier.recommended
            const isSelected = selectedTier === tier.id
            
            return (
              <div
                key={tier.id}
                data-tier={tier.id}
                className={`pricing-card group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden ${
                  isRecommended 
                    ? 'border-solena-pink scale-105 recommended' 
                    : isSelected
                    ? 'border-solena-pink-light'
                    : 'border-gray-100 hover:border-solena-pink-light'
                }`}
                onClick={() => selectTier(tier.id)}
                role="button"
                tabIndex={0}
              >
                {/* Badge recommandé */}
                {isRecommended && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-solena-pink text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      {t('comfort.recommended')}
                    </div>
                  </div>
                )}

                {/* Gradient de fond au hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                {/* Contenu de la carte */}
                <div className="relative z-10 p-8">
                  {/* En-tête avec icône et nom */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${tier.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {t(`${tier.name}.name`)}
                    </h3>
                    
                    {/* Prix */}
                    <div className="mb-4">
                      <div className="text-4xl font-bold text-gray-800">
                        {formatPrice(tier.basePrice)}
                      </div>
                      <div className="text-gray-500">
                        {t(`${tier.name}.period`)}
                      </div>
                    </div>
                  </div>

                  {/* Liste des fonctionnalités */}
                  <div className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-600 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bouton de sélection */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      selectTier(tier.id)
                      scrollToSimulator()
                    }}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      isRecommended
                        ? 'bg-solena-pink text-white hover:bg-solena-600 shadow-lg hover:shadow-xl'
                        : isSelected
                        ? 'bg-solena-pink text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-solena-pink hover:text-white'
                    }`}
                  >
                    {t('cta')}
                  </button>
                </div>

                {/* Effet de brillance au hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Informations complémentaires */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Sans engagement</h4>
            <p className="text-sm text-gray-600">Résiliable à tout moment sans frais</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Effet immédiat</h4>
            <p className="text-sm text-gray-600">Couverture dès la souscription</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Garantie satisfait</h4>
            <p className="text-sm text-gray-600">30 jours pour changer d'avis</p>
          </div>
        </div>

        {/* CTA vers le simulateur */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Besoin d'un tarif personnalisé selon vos revenus ?
          </p>
          <button
            onClick={scrollToSimulator}
            className="btn-primary inline-flex items-center text-lg px-8 py-4 shadow-xl hover:shadow-2xl"
          >
            Utiliser le simulateur
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}