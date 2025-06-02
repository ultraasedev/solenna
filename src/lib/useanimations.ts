/*
  Fichier: src/hooks/useAnimation.ts
  Hook personnalisé pour gérer les animations GSAP avec TypeScript
*/

'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useInView } from 'react-intersection-observer'
import type { BaseAnimationConfig, AnimationEventCallback } from '@/types/animations'

// Enregistrer ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface UseAnimationOptions {
  config: BaseAnimationConfig
  autoPlay?: boolean
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  onStart?: AnimationEventCallback
  onComplete?: AnimationEventCallback
  onUpdate?: AnimationEventCallback
}

interface UseAnimationReturn {
  ref: React.RefObject<HTMLElement>
  inViewRef: (node?: Element | null | undefined) => void
  isVisible: boolean
  isPlaying: boolean
  progress: number
  controls: {
    play: () => void
    pause: () => void
    reverse: () => void
    restart: () => void
    seek: (progress: number) => void
    kill: () => void
  }
  timeline: gsap.core.Timeline | null
}

export function useAnimation(options: UseAnimationOptions): UseAnimationReturn {
  const elementRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  // Hook pour détecter la visibilité
  const { ref: inViewRef, inView: isVisible } = useInView({
    threshold: options.threshold || 0.1,
    rootMargin: options.rootMargin || '0px',
    triggerOnce: options.triggerOnce !== false
  })

  // Fonction pour créer l'animation GSAP
  const createAnimation = useCallback(() => {
    if (!elementRef.current) return null

    const { config } = options
    const element = elementRef.current

    // Créer une timeline GSAP
    const timeline = gsap.timeline({
      paused: !options.autoPlay,
      onStart: () => {
        setIsPlaying(true)
        options.onStart?.({
          id: config.type,
          type: 'start',
          progress: 0,
          duration: config.duration,
          timestamp: Date.now(),
          target: element
        })
      },
      onComplete: () => {
        setIsPlaying(false)
        setProgress(1)
        options.onComplete?.({
          id: config.type,
          type: 'complete',
          progress: 1,
          duration: config.duration,
          timestamp: Date.now(),
          target: element
        })
      },
      onUpdate: function() {
        const newProgress = this.progress()
        setProgress(newProgress)
        options.onUpdate?.({
          id: config.type,
          type: 'update',
          progress: newProgress,
          duration: config.duration,
          timestamp: Date.now(),
          target: element
        })
      }
    })

    // Ajouter l'animation selon le type
    switch (config.type) {
      case 'fadeIn':
        timeline.fromTo(element, 
          { opacity: 0 },
          { 
            opacity: 1,
            duration: config.duration,
            ease: config.ease || 'power2.out',
            delay: config.delay || 0
          }
        )
        break

      case 'slideUp':
        timeline.fromTo(element,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: config.duration,
            ease: config.ease || 'power2.out',
            delay: config.delay || 0
          }
        )
        break

      case 'slideLeft':
        timeline.fromTo(element,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: config.duration,
            ease: config.ease || 'power2.out',
            delay: config.delay || 0
          }
        )
        break

      case 'slideRight':
        timeline.fromTo(element,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: config.duration,
            ease: config.ease || 'power2.out',
            delay: config.delay || 0
          }
        )
        break

      case 'scaleIn':
        timeline.fromTo(element,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: config.duration,
            ease: config.ease || 'back.out(1.7)',
            delay: config.delay || 0
          }
        )
        break

      case 'rotateIn':
        timeline.fromTo(element,
          { opacity: 0, rotation: -180, scale: 0.5 },
          {
            opacity: 1,
            rotation: 0,
            scale: 1,
            duration: config.duration,
            ease: config.ease || 'back.out(1.7)',
            delay: config.delay || 0
          }
        )
        break

      case 'bounceIn':
        timeline.fromTo(element,
          { opacity: 0, scale: 0.3 },
          {
            opacity: 1,
            scale: 1,
            duration: config.duration,
            ease: config.ease || 'bounce.out',
            delay: config.delay || 0
          }
        )
        break

      case 'zoomIn':
        timeline.fromTo(element,
          { opacity: 0, scale: 0, rotationZ: 180 },
          {
            opacity: 1,
            scale: 1,
            rotationZ: 0,
            duration: config.duration,
            ease: config.ease || 'back.out(2)',
            delay: config.delay || 0
          }
        )
        break

      default:
        // Animation par défaut
        timeline.fromTo(element,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: config.duration,
            ease: config.ease || 'power2.out',
            delay: config.delay || 0
          }
        )
    }

    // Ajouter ScrollTrigger si configuré
    if (config.scrollTrigger) {
      ScrollTrigger.create({
        trigger: config.scrollTrigger.trigger || element,
        start: config.scrollTrigger.start || 'top 80%',
        end: config.scrollTrigger.end,
        animation: timeline,
        toggleActions: config.scrollTrigger.toggleActions || 'play none none reverse',
        scrub: config.scrollTrigger.scrub,
        pin: config.scrollTrigger.pin,
        markers: config.scrollTrigger.markers || false,
        onEnter: config.scrollTrigger.onEnter,
        onLeave: config.scrollTrigger.onLeave,
        onEnterBack: config.scrollTrigger.onEnterBack,
        onLeaveBack: config.scrollTrigger.onLeaveBack
      })
    }

    return timeline
  }, [options])

  // Initialiser l'animation
  useEffect(() => {
    if (elementRef.current) {
      timelineRef.current = createAnimation()
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
        timelineRef.current = null
      }
    }
  }, [createAnimation])

  // Jouer l'animation quand l'élément devient visible
  useEffect(() => {
    if (isVisible && timelineRef.current && options.autoPlay !== false) {
      timelineRef.current.play()
    }
  }, [isVisible, options.autoPlay])

  // Contrôles de l'animation
  const controls = {
    play: () => {
      if (timelineRef.current) {
        timelineRef.current.play()
        setIsPlaying(true)
      }
    },
    pause: () => {
      if (timelineRef.current) {
        timelineRef.current.pause()
        setIsPlaying(false)
      }
    },
    reverse: () => {
      if (timelineRef.current) {
        timelineRef.current.reverse()
      }
    },
    restart: () => {
      if (timelineRef.current) {
        timelineRef.current.restart()
        setProgress(0)
      }
    },
    seek: (progress: number) => {
      if (timelineRef.current) {
        timelineRef.current.progress(progress)
        setProgress(progress)
      }
    },
    kill: () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
        timelineRef.current = null
        setIsPlaying(false)
        setProgress(0)
      }
    }
  }

  // Fonction pour fusionner les refs
  const setRefs = useCallback((element: Element | null | undefined) => {
    const htmlElement = element as HTMLElement | null
    if (elementRef.current !== htmlElement) {
      (elementRef as React.MutableRefObject<HTMLElement | null>).current = htmlElement
    }
    inViewRef(element)
  }, [inViewRef])

  return {
    ref: elementRef,
    inViewRef: setRefs,
    isVisible,
    isPlaying,
    progress,
    controls,
    timeline: timelineRef.current
  }
}