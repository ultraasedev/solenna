/*
  Fichier: src/components/layout/Header.tsx
  Composant Header avec navigation responsive et sélecteur de langue
  Utilise GSAP pour les animations et next-intl pour les traductions
*/

'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { gsap } from 'gsap'

export default function Header() {
  // États locaux pour la gestion du menu mobile et du scroll
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Hooks next-intl pour les traductions et la locale
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  // Liste des liens de navigation
  const navLinks = [
    { key: 'pathologies', href: '#pathologies' },
    { key: 'pricing', href: '#pricing' },
    { key: 'simulator', href: '#simulator' },
    { key: 'partners', href: '#partners' },
    { key: 'contact', href: '#contact' },
  ]

  // Effet pour détecter le scroll et animer le header
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animation GSAP pour l'apparition du header
  useEffect(() => {
    gsap.fromTo(
      '.header',
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  // Fonction pour changer de langue
  const switchLanguage = (newLocale: string) => {
    // Retirer la locale actuelle du pathname
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    
    // Construire la nouvelle URL avec la nouvelle locale
    const newPath = `/${newLocale}${pathnameWithoutLocale}`
    
    router.push(newPath)
  }

  // Fonction pour basculer le menu mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    
    // Animation GSAP pour le menu mobile
    if (!isMenuOpen) {
      gsap.fromTo(
        '.mobile-menu',
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
    } else {
      gsap.to('.mobile-menu', {
        x: '100%',
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      })
    }
  }

  // Fonction pour la navigation fluide vers les sections
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }
    setIsMenuOpen(false)
  }

  return (
    <header 
      className={`header fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo Solena avec animation au hover */}
          <Link 
            href={`/${locale}`}
            className="text-3xl font-bold text-solena-pink hover:scale-105 transition-transform duration-300"
          >
            Solena
          </Link>

          {/* Navigation desktop - cachée sur mobile */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => scrollToSection(link.href)}
                className="text-gray-700 hover:text-solena-pink font-medium transition-colors duration-300 relative group"
              >
                {t(link.key)}
                {/* Underline animation */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-solena-pink transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Sélecteur de langue et CTA - desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Boutons de langue */}
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => switchLanguage('fr')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  locale === 'fr'
                    ? 'bg-solena-pink text-white shadow-md'
                    : 'text-gray-600 hover:text-solena-pink'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  locale === 'en'
                    ? 'bg-solena-pink text-white shadow-md'
                    : 'text-gray-600 hover:text-solena-pink'
                }`}
              >
                EN
              </button>
            </div>

            {/* Bouton CTA principal */}
            <Link
              href={`/${locale}#simulator`}
              className="btn-primary inline-flex items-center"
              onClick={() => scrollToSection('#simulator')}
            >
              {t('joinSolena')}
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-gray-700 hover:text-solena-pink transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Menu mobile */}
        <div 
          className={`mobile-menu lg:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6">
            {/* Header du menu mobile */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-2xl font-bold text-solena-pink">Menu</span>
              <button 
                onClick={toggleMenu}
                className="p-2 text-gray-600 hover:text-solena-pink"
              >
                <X size={24} />
              </button>
            </div>

            {/* Liens de navigation mobile */}
            <nav className="space-y-4 mb-8">
              {navLinks.map((link) => (
                <button
                  key={link.key}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left py-3 px-4 text-gray-700 hover:text-solena-pink hover:bg-solena-50 rounded-lg transition-all duration-300"
                >
                  {t(link.key)}
                </button>
              ))}
            </nav>

            {/* Sélecteur de langue mobile */}
            <div className="flex justify-center space-x-2 mb-6">
              <button
                onClick={() => switchLanguage('fr')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  locale === 'fr'
                    ? 'bg-solena-pink text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Français
              </button>
              <button
                onClick={() => switchLanguage('en')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  locale === 'en'
                    ? 'bg-solena-pink text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                English
              </button>
            </div>

            {/* CTA mobile */}
            <Link
              href={`/${locale}#simulator`}
              className="btn-primary w-full text-center"
              onClick={() => {
                scrollToSection('#simulator')
                toggleMenu()
              }}
            >
              {t('joinSolena')}
            </Link>
          </div>
        </div>

        {/* Overlay pour fermer le menu mobile */}
        {isMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-[-1]"
            onClick={toggleMenu}
          />
        )}
      </div>
    </header>
  )
}