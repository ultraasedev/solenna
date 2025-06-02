/*
  Fichier: src/components/animations/CounterAnimation.tsx
  Composant pour animer les compteurs numériques avec GSAP
  Utilisé dans les statistiques du Hero
*/

'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useInView } from 'react-intersection-observer'

interface CounterAnimationProps {
  end: number          // Valeur finale du compteur
  duration?: number    // Durée de l'animation en secondes
  suffix?: string      // Suffixe à ajouter (€, M, h, etc.)
  prefix?: string      // Préfixe à ajouter
  decimals?: number    // Nombre de décimales
  separator?: string   // Séparateur des milliers
  delay?: number       // Délai avant l'animation
}

export default function CounterAnimation({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  decimals = 0,
  separator = ' ',
  delay = 0
}: CounterAnimationProps) {
  // Référence pour l'élément du compteur
  const counterRef = useRef<HTMLSpanElement>(null)
  
  // Hook pour détecter quand l'élément entre dans la vue
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5,      // Déclencher quand 50% de l'élément est visible
    triggerOnce: true    // Ne déclencher qu'une seule fois
  })

  // Fonction pour formater les nombres
  const formatNumber = (value: number): string => {
    const formatted = value.toFixed(decimals)
    
    // Ajouter le séparateur des milliers si nécessaire
    if (separator && value >= 1000) {
      return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    }
    
    return formatted
  }

  // Animation du compteur avec GSAP
  useEffect(() => {
    if (inView && counterRef.current) {
      const element = counterRef.current
      
      // Objet pour stocker la valeur animée
      const counter = { value: 0 }
      
      // Animation GSAP
      gsap.to(counter, {
        value: end,
        duration: duration,
        delay: delay,
        ease: 'power2.out',
        onUpdate: () => {
          // Mettre à jour le texte pendant l'animation
          if (element) {
            const formattedValue = formatNumber(counter.value)
            element.textContent = `${prefix}${formattedValue}${suffix}`
          }
        },
        onComplete: () => {
          // S'assurer que la valeur finale est correcte
          if (element) {
            const formattedValue = formatNumber(end)
            element.textContent = `${prefix}${formattedValue}${suffix}`
          }
        }
      })
    }
  }, [inView, end, duration, suffix, prefix, decimals, separator, delay])

  // Fonction pour fusionner les refs
  const setRefs = (element: HTMLSpanElement | null) => {
    if (counterRef.current !== element) {
      (counterRef as React.MutableRefObject<HTMLSpanElement | null>).current = element
    }
    inViewRef(element)
  }

  return (
    <span 
      ref={setRefs}
      className="inline-block tabular-nums"
    >
      {prefix}0{suffix}
    </span>
  )
}