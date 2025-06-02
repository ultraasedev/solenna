/*
  Fichier: src/app/[locale]/page.tsx
  Page d'accueil principale de Solena
  Utilise next-intl pour l'internationalisation et GSAP pour les animations
*/

import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import Header from '@/components/layout/header'
import HeroSection from '@/components/sections/HeroSection'
import PathologiesSection from '@/components/sections/PathologiesSection'
import PricingSection from '@/components/sections/PricingSection'
import SimulatorSection from '@/components/sections/SimulatorSection'
import CoverageSection from '@/components/sections/CoverageSection'
import Footer from '@/components/layout/Footer'
import ScrollAnimations from '@/components/animations/ScrollAnimations'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  
  // Active les traductions statiques pour cette locale
  // Nécessaire pour les performances en mode statique
  setRequestLocale(locale)

  return (
    <>
      {/* Composant qui initialise les animations GSAP au scroll */}
      <ScrollAnimations />
      
      {/* Header avec navigation et sélecteur de langue */}
      <Header />
      
      {/* Contenu principal de la page */}
      <main className="min-h-screen">
        {/* Section Hero avec title principal et CTA */}
        <HeroSection />
        
        {/* Section des pathologies prises en charge */}
        <PathologiesSection />
        
        {/* Section des tarifs avec 3 formules */}
        <PricingSection />
        
        {/* Simulateur de cotisation interactif */}
        <SimulatorSection />
        
        {/* Section détaillant la couverture mutuelle */}
        <CoverageSection />
      </main>
      
      {/* Footer avec liens et informations légales */}
      <Footer />
    </>
  )
}