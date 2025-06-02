/*
  Fichier: src/components/animations/ScrollAnimations.tsx
  Composant global qui initialise toutes les animations GSAP au scroll
  Se charge automatiquement au montage de l'application
*/

'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Enregistrer le plugin ScrollTrigger seulement côté client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ScrollAnimations() {
  useEffect(() => {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') return

    // Configuration globale de GSAP
    gsap.config({
      nullTargetWarn: false // Éviter les warnings pour les éléments non trouvés
    })

    // Animation fade-in générique pour tous les éléments avec la classe
    gsap.utils.toArray('.gsap-fade-in').forEach((element: any) => {
      gsap.fromTo(element, 
        { 
          opacity: 0, 
          y: 50 
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',      // Démarre quand le top de l'élément atteint 80% de la viewport
            end: 'bottom 20%',     // Termine quand le bottom atteint 20% de la viewport
            toggleActions: 'play none none reverse', // play, pause, resume, reset, restart, complete, reverse, none
            markers: false         // Désactiver les marqueurs de debug
          }
        }
      )
    })

    // Animation slide-left pour les éléments venant de la gauche
    gsap.utils.toArray('.gsap-slide-left').forEach((element: any) => {
      gsap.fromTo(element,
        { 
          opacity: 0, 
          x: -100 
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    // Animation slide-right pour les éléments venant de la droite
    gsap.utils.toArray('.gsap-slide-right').forEach((element: any) => {
      gsap.fromTo(element,
        { 
          opacity: 0, 
          x: 100 
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    // Animation scale-in pour les cartes avec effet d'échelle
    gsap.utils.toArray('.gsap-scale-in').forEach((element: any, index) => {
      gsap.fromTo(element,
        { 
          opacity: 0, 
          scale: 0.8,
          rotationY: 15 
        },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.6,
          ease: 'back.out(1.7)', // Effet de rebond
          delay: index * 0.1,    // Délai progressif pour effet de cascade
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    // Animation de révélation de texte pour les titres
    gsap.utils.toArray('.gsap-text-reveal').forEach((element: any) => {
      gsap.fromTo(element,
        { 
          opacity: 0,
          y: 100,
          skewY: 7
        },
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    // Animation de compteur pour les nombres
    gsap.utils.toArray('.gsap-counter').forEach((element: any) => {
      const finalValue = parseInt(element.getAttribute('data-count') || '0')
      const suffix = element.getAttribute('data-suffix') || ''
      
      const counter = { value: 0 }
      
      gsap.to(counter, {
        value: finalValue,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          element.textContent = Math.round(counter.value) + suffix
        },
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })
    })

    // Animation de parallax pour les éléments décoratifs
    gsap.utils.toArray('.gsap-parallax').forEach((element: any) => {
      gsap.to(element, {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true // Animation liée au scroll
        }
      })
    })

    // Animation de rotation continue pour les éléments décoratifs
    gsap.utils.toArray('.gsap-rotate').forEach((element: any) => {
      gsap.to(element, {
        rotation: 360,
        duration: 20,
        ease: 'none',
        repeat: -1
      })
    })

    // Animation de flottement pour les cartes hero
    gsap.utils.toArray('.gsap-float').forEach((element: any, index) => {
      gsap.to(element, {
        y: -20,
        duration: 2 + index * 0.5,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        delay: index * 0.3
      })
    })

    // Animation d'apparition progressive pour les listes
    gsap.utils.toArray('.gsap-stagger').forEach((container: any) => {
      const items = container.querySelectorAll('.gsap-stagger-item')
      
      gsap.fromTo(items,
        { 
          opacity: 0, 
          y: 30 
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1, // Délai entre chaque élément
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    // Animation de soulignement pour les liens et boutons
    gsap.utils.toArray('.gsap-underline').forEach((element: any) => {
      const underline = element.querySelector('.underline')
      
      if (underline) {
        gsap.set(underline, { scaleX: 0, transformOrigin: 'left center' })
        
        gsap.to(underline, {
          scaleX: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        })
      }
    })

    // Refresh ScrollTrigger après initialisation
    ScrollTrigger.refresh()

    // Fonction de nettoyage
    return () => {
      // Supprimer tous les ScrollTriggers pour éviter les fuites mémoire
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      
      // Nettoyer les timelines GSAP
      gsap.globalTimeline.clear()
    }
  }, []) // Effet exécuté une seule fois au montage

  // Ce composant ne rend rien visuellement
  return null
}