/*
  Footer Solena amélioré avec animations GSAP et toutes les fonctionnalités
  Design responsive avec sections bien organisées
*/

'use client'

import { useState, useEffect, useRef } from 'react'
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send, CheckCircle, Shield, Award, Lock } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Enregistrer ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Footer() {
  const [emailNewsletter, setEmailNewsletter] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'loading' | 'success' | 'error' | null>(null)
  const footerRef = useRef<HTMLElement>(null)

  // Animation GSAP pour le footer
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation d'apparition des colonnes
      const footerColumns = gsap.utils.toArray('.footer-column') as Element[]
      footerColumns.forEach((column, index) => {
        gsap.fromTo(column as HTMLElement,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: column as HTMLElement,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

      // Animation des icônes sociales
      const socialIcons = gsap.utils.toArray('.social-icon') as Element[]
      socialIcons.forEach((icon, index) => {
        gsap.fromTo(icon as HTMLElement,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            delay: 0.8 + index * 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

    }, footerRef)

    return () => ctx.revert()
  }, [])

  // Soumission newsletter
  const handleNewsletterSubmit = async () => {
    if (!emailNewsletter || !emailNewsletter.includes('@')) return

    setNewsletterStatus('loading')
    
    // Simulation API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setNewsletterStatus('success')
      setEmailNewsletter('')
      
      // Reset status après 3 secondes
      setTimeout(() => setNewsletterStatus(null), 3000)
    } catch (error) {
      setNewsletterStatus('error')
      setTimeout(() => setNewsletterStatus(null), 3000)
    }
  }

  // Configuration des liens
  const pathologiesLinks = [
    { name: 'Endométriose', href: '#pathologies', icon: '🌸' },
    { name: 'Cardiovasculaire', href: '#pathologies', icon: '❤️' },
    { name: 'Diabète', href: '#pathologies', icon: '🩺' },
    { name: 'Cancer', href: '#pathologies', icon: '🎗️' },
    { name: 'Santé mentale', href: '#pathologies', icon: '🧠' }
  ]

  const servicesItems = [
    'Mutuelle complète sans avance de frais',
    'Téléconsultation 24h/7j incluse', 
    'Application mobile avec IA',
    'Support personnalisé par pathologie'
  ]

  const legalLinks = [
    { name: 'Mentions légales', href: '/legal/mentions' },
    { name: 'Politique de confidentialité', href: '/legal/privacy' },
    { name: 'Conditions générales', href: '/legal/terms' },
    { name: 'Cookies', href: '/legal/cookies' },
    { name: 'Nous contacter', href: '/contact' }
  ]

  const certifications = [
    { name: 'RGPD Conforme', icon: Lock, color: 'text-green-500' },
    { name: 'HDS Certifié', icon: Shield, color: 'text-blue-500' },
    { name: 'ISO 27001', icon: Award, color: 'text-purple-500' },
    { name: 'Agrément ACPR', icon: CheckCircle, color: 'text-green-500' }
  ]

  return (
    <footer ref={footerRef} className="bg-gray-900 text-white relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-pink-400 to-rose-500 rounded-full transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Section principale */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Colonne 1: À propos de Solena */}
          <div className="footer-column lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text text-transparent">
                Solena
              </h3>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              La première e-mutuelle solidaire qui prend en charge à 100% vos maladies chroniques. 
              Plus jamais d'avance de frais pour votre santé.
            </p>

            {/* Informations de contact */}
            <div className="space-y-3 mb-6">
              <a href="mailto:contact@solena.fr" className="flex items-center text-gray-300 hover:text-pink-400 transition-colors duration-300 group">
                <Mail className="w-4 h-4 mr-3 text-pink-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">contact@solena.fr</span>
              </a>
              <a href="tel:0189169200" className="flex items-center text-gray-300 hover:text-pink-400 transition-colors duration-300 group">
                <Phone className="w-4 h-4 mr-3 text-pink-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">01 89 16 92 00</span>
              </a>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-pink-400" />
                <span className="text-sm">75001 Paris, France</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-pink-400">
                Newsletter Santé
              </h4>
              <div className="flex">
                <input
                  type="email"
                  value={emailNewsletter}
                  onChange={(e) => setEmailNewsletter(e.target.value)}
                  placeholder="votre@email.fr"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 transition-colors duration-300"
                  disabled={newsletterStatus === 'loading'}
                  onKeyPress={(e) => e.key === 'Enter' && handleNewsletterSubmit()}
                />
                <button 
                  onClick={handleNewsletterSubmit}
                  disabled={newsletterStatus === 'loading'}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-r-lg transition-all duration-300 flex items-center disabled:opacity-50"
                >
                  {newsletterStatus === 'loading' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {/* Status messages */}
              {newsletterStatus === 'success' && (
                <div className="mt-2 flex items-center text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Inscription réussie ! 🎉
                </div>
              )}
              {newsletterStatus === 'error' && (
                <div className="mt-2 text-red-400 text-sm">
                  Erreur lors de l'inscription. Réessayez.
                </div>
              )}
            </div>
          </div>

          {/* Colonne 2: Pathologies */}
          <div className="footer-column">
            <h4 className="text-lg font-semibold mb-6 text-pink-400">
              Pathologies prises en charge
            </h4>
            <ul className="space-y-3">
              {pathologiesLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-pink-400 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                    <span className="w-2 h-2 bg-pink-400 rounded-full ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Navigation rapide */}
            <h4 className="text-lg font-semibold mb-4 mt-8 text-pink-400">
              Navigation
            </h4>
            <ul className="space-y-3">
              {['Pathologies', 'Tarifs', 'Simulateur', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      const element = document.querySelector(`#${item.toLowerCase()}`)
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="text-gray-300 hover:text-pink-400 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3: Services */}
          <div className="footer-column">
            <h4 className="text-lg font-semibold mb-6 text-pink-400">
              Nos services
            </h4>
            <ul className="space-y-3">
              {servicesItems.map((service, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm leading-relaxed">
                    {service}
                  </span>
                </li>
              ))}
            </ul>

            {/* Horaires */}
            <h4 className="text-lg font-semibold mb-4 mt-8 text-pink-400">
              Horaires support
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Lun - Ven</span>
                <span className="text-green-400">9h - 19h</span>
              </div>
              <div className="flex justify-between">
                <span>Samedi</span>
                <span className="text-green-400">9h - 17h</span>
              </div>
              <div className="flex justify-between">
                <span>Dimanche</span>
                <span className="text-red-400">Fermé</span>
              </div>
              <div className="text-xs text-gray-400 mt-3 p-2 bg-gray-800 rounded">
                💬 Chat 24h/7j via l'application
              </div>
            </div>
          </div>

          {/* Colonne 4: Légal et Réseaux */}
          <div className="footer-column">
            <h4 className="text-lg font-semibold mb-6 text-pink-400">
              Informations légales
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-pink-400 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Réseaux sociaux */}
            <div className="mt-8">
              <h5 className="text-lg font-semibold mb-4 text-pink-400">
                Suivez-nous
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="https://facebook.com/solena.mutuelle" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon flex items-center justify-center w-full h-12 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors duration-300 group"
                >
                  <Facebook className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                </a>
                <a 
                  href="https://twitter.com/solena_mutuelle" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon flex items-center justify-center w-full h-12 bg-gray-800 rounded-lg hover:bg-blue-400 transition-colors duration-300 group"
                >
                  <Twitter className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                </a>
                <a 
                  href="https://instagram.com/solena_mutuelle" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon flex items-center justify-center w-full h-12 bg-gray-800 rounded-lg hover:bg-pink-500 transition-colors duration-300 group"
                >
                  <Instagram className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                </a>
                <a 
                  href="https://linkedin.com/company/solena" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon flex items-center justify-center w-full h-12 bg-gray-800 rounded-lg hover:bg-blue-700 transition-colors duration-300 group"
                >
                  <Linkedin className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                </a>
              </div>
            </div>

            {/* Certifications */}
            <div className="mt-8">
              <h5 className="text-sm font-semibold mb-3 text-gray-400">
                Certifications & Sécurité
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {certifications.map((cert) => {
                  const IconComponent = cert.icon
                  return (
                    <div key={cert.name} className="flex items-center text-xs text-gray-400 hover:text-gray-300 transition-colors duration-300">
                      <IconComponent className={`w-3 h-3 mr-2 ${cert.color}`} />
                      <span>{cert.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section partenaires */}
      <div className="border-t border-gray-800 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <h4 className="text-center text-lg font-semibold mb-6 text-gray-400">
            Nos partenaires de confiance
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center opacity-60">
            {[
              { name: 'Stripe', desc: 'Paiements sécurisés' },
              { name: 'Doctolib', desc: 'Réservation RDV' },
              { name: 'Pharmavie', desc: 'Réseau pharmacies' },
              { name: 'EndoFrance', desc: 'Association patientes' }
            ].map((partner) => (
              <div key={partner.name} className="bg-gray-800 h-16 rounded-lg flex flex-col items-center justify-center hover:opacity-80 transition-opacity duration-300">
                <span className="text-gray-400 text-sm font-medium">{partner.name}</span>
                <span className="text-xs text-gray-500">{partner.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Barre de copyright */}
      <div className="border-t border-gray-800 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
              <p className="text-gray-400 text-sm mb-2 md:mb-0 md:mr-4">
                © 2024 Solena. Tous droits réservés.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span>Mutuelle n° 123456789</span>
                <span>•</span>
                <span>ACPR - Code 987654321</span>
                <span>•</span>
                <span>SIRET 12345678901234</span>
              </div>
            </div>
            
            <div className="flex items-center text-xs text-gray-400">
              <Heart className="w-4 h-4 text-red-400 mr-1" />
              <span>Made with love in France 🇫🇷</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}