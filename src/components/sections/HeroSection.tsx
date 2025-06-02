/*
  Fichier: src/components/sections/HeroSection.tsx
  Section Hero principale avec titre, stats animées et cartes flottantes
  Utilise GSAP pour les animations et next-intl pour les traductions
*/

'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { Heart, Activity, Pill } from 'lucide-react'
import CounterAnimation from '@/components/animations/CounterAnimation'

export default function HeroSection() {
  // Références pour les animations GSAP
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  // Hook pour les traductions
  const t = useTranslations('hero')

  // Animation d'entrée avec GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline principale pour séquencer les animations
      const tl = gsap.timeline({ delay: 0.5 })

      // Animation du titre avec effet de révélation de texte
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 100 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: 'power3.out'
        }
      )
      // Animation du sous-titre
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power2.out' 
        },
        '-=0.6' // Commence avant la fin de l'animation précédente
      )
      // Animation du bouton CTA
      .fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          ease: 'back.out(1.7)' 
        },
        '-=0.4'
      )

      // Animation des cartes flottantes avec délais échelonnés
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.floating-card')
        cards.forEach((card, index) => {
          gsap.fromTo(
            card,
            { 
              opacity: 0, 
              y: 100, 
              rotation: index % 2 === 0 ? -10 : 10,
              scale: 0.8 
            },
            {
              opacity: 1,
              y: 0,
              rotation: index % 2 === 0 ? -5 : 5,
              scale: 1,
              duration: 1,
              ease: 'power2.out',
              delay: 1 + index * 0.2
            }
          )

          // Animation de flottement continue
          gsap.to(card, {
            y: -20,
            duration: 2 + index * 0.5,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
            delay: 2 + index * 0.3
          })
        })
      }
    }, heroRef)

    // Cleanup
    return () => ctx.revert()
  }, [])

  // Fonction pour scroll vers le simulateur
  const scrollToSimulator = () => {
    const element = document.querySelector('#simulator')
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <section 
      ref={heroRef}
      className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-solena-50 via-white to-solena-100"
    >
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-solena-pink-light rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-solena-pink-pale rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-solena-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <div className="text-center lg:text-left space-y-8">
            {/* Titre principal avec highlighting */}
            <h1 
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <span className="text-gray-800">{t('title')} </span>
              <span className="text-solena-pink relative">
                {t('titleHighlight')}
                {/* Underline décoratif */}
                <svg 
                  className="absolute -bottom-2 left-0 w-full h-3" 
                  viewBox="0 0 300 12" 
                  fill="none"
                >
                  <path 
                    d="M3 9C118.666 4.66667 251.8 1.2 297 5" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>
              </span>
              <br />
              <span className="text-gray-800">{t('titleEnd')}</span>
            </h1>

            {/* Sous-titre descriptif */}
            <p 
              ref={subtitleRef}
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {t('subtitle')}
            </p>

            {/* Statistiques animées */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-solena-pink mb-2">
                  <CounterAnimation end={15} suffix="M" />
                </div>
                <p className="text-sm text-gray-600">{t('stats.patients')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-solena-pink mb-2">
                  <CounterAnimation end={0} suffix="€" />
                </div>
                <p className="text-sm text-gray-600">{t('stats.advance')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-solena-pink mb-2">
                  <CounterAnimation end={24} suffix="h" />
                </div>
                <p className="text-sm text-gray-600">{t('stats.reimbursement')}</p>
              </div>
            </div>

            {/* Bouton CTA principal */}
            <a
              ref={ctaRef}
              href="#simulator"
              onClick={(e) => {
                e.preventDefault()
                scrollToSimulator()
              }}
              className="btn-primary inline-flex items-center text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {t('cta')}
              <svg 
                className="ml-2 w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" 
                />
              </svg>
            </a>
          </div>

          {/* Cartes flottantes visuelles */}
          <div ref={cardsRef} className="relative h-96 lg:h-full">
            {/* Carte Endométriose */}
            <div className="floating-card absolute top-8 left-4 lg:left-8 w-64 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-pink rounded-full flex items-center justify-center mr-3">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800">Endométriose</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Chirurgies, PMA, suivi spécialisé
              </p>
              <div className="text-lg font-bold text-solena-pink">
                15 000€/an pris en charge
              </div>
            </div>

            {/* Carte Cardiovasculaire */}
            <div className="floating-card absolute top-32 right-4 lg:right-8 w-64 transform rotate-[5deg] hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-pink rounded-full flex items-center justify-center mr-3">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800">Cardiovasculaire</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Cardiologie, rééducation, examens
              </p>
              <div className="text-lg font-bold text-solena-pink">
                100% pris en charge
              </div>
            </div>

            {/* Carte Diabète */}
            <div className="floating-card absolute bottom-8 left-12 lg:left-16 w-64 transform rotate-[-3deg] hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-pink rounded-full flex items-center justify-center mr-3">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800">Diabète</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Matériel, consultations, podologie
              </p>
              <div className="text-lg font-bold text-solena-pink">
                0€ de reste à charge
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-solena-pink rounded-full flex justify-center">
          <div className="w-1 h-3 bg-solena-pink rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}