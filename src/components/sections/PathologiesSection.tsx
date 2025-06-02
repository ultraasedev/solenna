/*
  Fichier: src/components/sections/PathologiesSection.tsx
  Section présentant les pathologies prises en charge par Solena
  Cartes animées avec GSAP et icônes Lucide React
*/

'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Heart, 
  Activity, 
  Pill, 
  Shield, 
  Brain,
  Stethoscope
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

// Enregistrement du plugin ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Interface pour les pathologies
interface PathologyCard {
  id: string
  icon: React.ComponentType<{ className?: string }>
  coverage: number
  color: string
}

export default function PathologiesSection() {
  // Référence pour la section
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  
  // Hook pour les traductions
  const t = useTranslations('pathologies')

  // Configuration des pathologies avec leurs icônes et couleurs
  const pathologies: PathologyCard[] = [
    {
      id: 'endometriosis',
      icon: Heart,
      coverage: 15000,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'cardiovascular',
      icon: Activity,
      coverage: 12000,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'diabetes',
      icon: Pill,
      coverage: 8000,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'cancer',
      icon: Shield,
      coverage: 20000,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'mentalHealth',
      icon: Brain,
      coverage: 6000,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'chronic',
      icon: Stethoscope,
      coverage: 10000,
      color: 'from-orange-500 to-amber-500'
    }
  ]

  // Animations GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation du titre de section
      gsap.fromTo('.section-title', 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Animation du sous-titre
      gsap.fromTo('.section-subtitle',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Animation des cartes avec effet de cascade
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.pathology-card')
        
        cards.forEach((card, index) => {
          gsap.fromTo(card as HTMLElement,
            { 
              opacity: 0, 
              y: 80,
              scale: 0.8,
              rotationY: 15
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationY: 0,
              duration: 0.8,
              delay: index * 0.15,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: card as HTMLElement,
                start: 'top 90%',
                end: 'bottom 10%',
                toggleActions: 'play none none reverse'
              }
            }
          )

          // Animation au hover
          const cardElement = card as HTMLElement
          
          cardElement.addEventListener('mouseenter', () => {
            gsap.to(card as HTMLElement, {
              y: -15,
              scale: 1.05,
              duration: 0.3,
              ease: 'power2.out'
            })
          })

          cardElement.addEventListener('mouseleave', () => {
            gsap.to(card as HTMLElement, {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: 'power2.out'
            })
          })
        })
      }

      // Animation des montants de couverture
      gsap.utils.toArray('.coverage-amount').forEach((element, index) => {
        gsap.fromTo(element as HTMLElement,
          { scale: 0, rotation: 180 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            delay: index * 0.1 + 0.5,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: element as HTMLElement,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

    }, sectionRef)

    // Cleanup
    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="pathologies" 
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-solena-pink-pale to-transparent rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-solena-100 to-transparent rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <h2 className="section-title text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {t('title')}
          </h2>
          <p className="section-subtitle text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Grille des pathologies */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {pathologies.map((pathology, index) => {
            const IconComponent = pathology.icon
            
            return (
              <div
                key={pathology.id}
                className="pathology-card group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
              >
                {/* Gradient de fond au hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pathology.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
                
                {/* Contenu de la carte */}
                <div className="relative z-10">
                  {/* Icône animée */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${pathology.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Titre de la pathologie */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-solena-pink transition-colors duration-300">
                    {t(`${pathology.id}.title`)}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {t(`${pathology.id}.description`)}
                  </p>

                  {/* Montant de couverture */}
                  <div className="coverage-amount text-center">
                    <div className="text-3xl font-bold text-solena-pink mb-2">
                      {formatPrice(pathology.coverage)}
                    </div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                      {t('covered')}
                    </div>
                  </div>

                  {/* Badge "100% pris en charge" */}
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
        </div>

        {/* CTA de fin de section */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6">
            Et bien d'autres pathologies chroniques prises en charge
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center px-8 py-3 bg-solena-pink text-white font-semibold rounded-full hover:bg-solena-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#pricing')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              })
            }}
          >
            Découvrir nos tarifs
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}