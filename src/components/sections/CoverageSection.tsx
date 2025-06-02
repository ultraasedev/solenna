/*
  Fichier: src/components/sections/CoverageSection.tsx
  Section détaillant la couverture mutuelle complète de Solena
  Présente les garanties de base en plus des spécialisations chroniques
*/

'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Stethoscope, 
  Smile, 
  Eye, 
  Building2, 
  Flower,
  Shield
} from 'lucide-react'

// Enregistrement du plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function CoverageSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const t = useTranslations('coverage')

  // Configuration des garanties avec icônes
  const coverageItems = [
    {
      id: 'general',
      icon: Stethoscope,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'dental',
      icon: Smile,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'optical',
      icon: Eye,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'hospital',
      icon: Building2,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'alternative',
      icon: Flower,
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  // Animations GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation du titre
      gsap.fromTo('.coverage-title',
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

      // Animation des cartes de garanties
      gsap.utils.toArray('.coverage-card').forEach((card, index) => {
        gsap.fromTo(card as HTMLElement,
          { 
            opacity: 0, 
            y: 80,
            rotationX: 15
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card as HTMLElement,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
    >
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-solena-pink-pale to-transparent rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-solena-100 to-transparent rounded-full transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-solena-pink rounded-2xl mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="coverage-title text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Grille des garanties */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {coverageItems.map((item, index) => {
            const IconComponent = item.icon
            
            return (
              <div
                key={item.id}
                className="coverage-card group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
              >
                {/* Gradient de fond au hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
                
                {/* Contenu de la carte */}
                <div className="relative z-10">
                  {/* Icône */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Titre */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-solena-pink transition-colors duration-300">
                    {t(`${item.id}.title`)}
                  </h3>

                  {/* Description de la couverture */}
                  <p className="text-gray-600 leading-relaxed">
                    {t(`${item.id}.coverage`)}
                  </p>

                  {/* Badge 100% */}
                  <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    100%
                  </div>
                </div>

                {/* Effet de brillance au hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </div>
            )
          })}

          {/* Carte spéciale "En plus" pour les pathologies chroniques */}
          <div className="coverage-card lg:col-span-3 bg-gradient-to-r from-solena-pink to-solena-600 text-white rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold mb-4">
                En plus : Spécialisation maladies chroniques
              </h3>
              
              <p className="text-xl opacity-90 mb-6 max-w-3xl mx-auto">
                Bénéficiez d'une prise en charge à 100% pour votre pathologie chronique, 
                sans avance de frais ni reste à charge.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">15 000€</div>
                  <div className="text-sm opacity-80">Endométriose</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">20 000€</div>
                  <div className="text-sm opacity-80">Cancer</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">12 000€</div>
                  <div className="text-sm opacity-80">Cardiovasculaire</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">8 000€</div>
                  <div className="text-sm opacity-80">Diabète</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">6 000€</div>
                  <div className="text-sm opacity-80">Santé mentale</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">10 000€</div>
                  <div className="text-sm opacity-80">Autres chroniques</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Prêt à bénéficier de cette couverture complète ?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Calculez votre cotisation personnalisée en 2 minutes
          </p>
          <a
            href="#simulator"
            className="btn-primary inline-flex items-center text-lg px-8 py-4 shadow-xl hover:shadow-2xl"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#simulator')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              })
            }}
          >
            Calculer ma cotisation
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}