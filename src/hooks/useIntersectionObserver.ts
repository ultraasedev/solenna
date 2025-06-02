/*
  Fichier: src/hooks/useIntersectionObserver.ts
  Hook personnalisé pour observer l'intersection des éléments avec la viewport
  Utilisé pour déclencher les animations au scroll
*/

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  triggerOnce?: boolean
  skip?: boolean
  initialInView?: boolean
  trackVisibility?: boolean
  delay?: number
}

interface UseIntersectionObserverReturn {
  ref: React.RefCallback<Element>
  inView: boolean
  entry: IntersectionObserverEntry | undefined
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    triggerOnce = false,
    skip = false,
    initialInView = false,
    trackVisibility = false,
    delay = 0
  } = options

  const [inView, setInView] = useState(initialInView)
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const elementRef = useRef<Element | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fonction callback pour l'observer
  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    setEntry(entry)

    const isIntersecting = entry.isIntersecting

    if (delay > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        setInView(isIntersecting)
        
        // Si triggerOnce est activé et l'élément est visible, déconnecter l'observer
        if (triggerOnce && isIntersecting && observerRef.current) {
          observerRef.current.disconnect()
          observerRef.current = null
        }
      }, delay)
    } else {
      setInView(isIntersecting)
      
      // Si triggerOnce est activé et l'élément est visible, déconnecter l'observer
      if (triggerOnce && isIntersecting && observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [triggerOnce, delay])

  // Fonction pour définir la ref de l'élément
  const setRef = useCallback((node: Element | null) => {
    // Nettoyer l'observer précédent
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    // Nettoyer le timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Si skip est activé ou pas de node, ne pas observer
    if (skip || !node) {
      elementRef.current = node
      return
    }

    elementRef.current = node

    // Vérifier le support de IntersectionObserver
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      try {
        // Créer un nouvel observer
        observerRef.current = new IntersectionObserver(handleIntersect, {
          threshold,
          root,
          rootMargin
        })

        // Observer l'élément
        observerRef.current.observe(node)
      } catch (error) {
        console.warn('Erreur lors de la création de IntersectionObserver:', error)
        // Fallback: considérer l'élément comme visible
        setInView(true)
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
      setInView(true)
    }
  }, [skip, threshold, root, rootMargin, handleIntersect])

  // Nettoyer à la destruction du composant
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  // Gérer les changements d'options
  useEffect(() => {
    if (observerRef.current && elementRef.current) {
      // Recréer l'observer si les options ont changé
      observerRef.current.disconnect()
      
      observerRef.current = new IntersectionObserver(handleIntersect, {
        threshold,
        root,
        rootMargin
      })

      observerRef.current.observe(elementRef.current)
    }
  }, [threshold, root, rootMargin, handleIntersect])

  return {
    ref: setRef,
    inView,
    entry
  }
}

// Hook spécialisé pour les animations
export function useIntersectionAnimation(
  options: UseIntersectionObserverOptions & {
    animationDelay?: number
    onEnter?: () => void
    onLeave?: () => void
  } = {}
) {
  const { animationDelay = 0, onEnter, onLeave, ...intersectionOptions } = options
  const [hasAnimated, setHasAnimated] = useState(false)
  
  const { ref, inView, entry } = useIntersectionObserver({
    triggerOnce: true,
    threshold: 0.1,
    ...intersectionOptions
  })

  useEffect(() => {
    if (inView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true)
        onEnter?.()
      }, animationDelay)

      return () => clearTimeout(timer)
    } else if (!inView && hasAnimated && !intersectionOptions.triggerOnce) {
      onLeave?.()
    }
  }, [inView, hasAnimated, animationDelay, onEnter, onLeave, intersectionOptions.triggerOnce])

  return {
    ref,
    inView: hasAnimated,
    entry,
    hasAnimated
  }
}

// Hook pour mesurer les métriques de visibilité
export function useVisibilityMetrics() {
  const [metrics, setMetrics] = useState({
    timeVisible: 0,
    percentageVisible: 0,
    firstVisibleTime: null as Date | null,
    lastVisibleTime: null as Date | null,
    visibilityCount: 0
  })

  const startTimeRef = useRef<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const { ref, inView, entry } = useIntersectionObserver({
    threshold: [0, 0.25, 0.5, 0.75, 1],
    trackVisibility: true
  })

  useEffect(() => {
    if (inView) {
      // Première fois visible
      if (!metrics.firstVisibleTime) {
        setMetrics(prev => ({
          ...prev,
          firstVisibleTime: new Date(),
          visibilityCount: prev.visibilityCount + 1
        }))
      }

      // Commencer à mesurer le temps
      startTimeRef.current = new Date()
      
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const now = new Date()
          const timeInView = now.getTime() - startTimeRef.current.getTime()
          
          setMetrics(prev => ({
            ...prev,
            timeVisible: prev.timeVisible + 100, // Incrément de 100ms
            lastVisibleTime: now
          }))
        }
      }, 100)
    } else {
      // Arrêter de mesurer
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      startTimeRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [inView, metrics.firstVisibleTime])

  // Calculer le pourcentage de visibilité
  useEffect(() => {
    if (entry) {
      const percentage = Math.round(entry.intersectionRatio * 100)
      setMetrics(prev => ({
        ...prev,
        percentageVisible: percentage
      }))
    }
  }, [entry])

  return {
    ref,
    inView,
    metrics,
    resetMetrics: () => setMetrics({
      timeVisible: 0,
      percentageVisible: 0,
      firstVisibleTime: null,
      lastVisibleTime: null,
      visibilityCount: 0
    })
  }
}

// Hook pour lazy loading d'images
export function useLazyImage(src: string, options: UseIntersectionObserverOptions = {}) {
  const [imageSrc, setImageSrc] = useState<string>()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const { ref, inView } = useIntersectionObserver({
    triggerOnce: true,
    threshold: 0.1,
    ...options
  })

  useEffect(() => {
    if (inView && src && !imageSrc) {
      const img = new Image()
      
      img.onload = () => {
        setImageSrc(src)
        setImageLoaded(true)
      }
      
      img.onerror = () => {
        setImageError(true)
      }
      
      img.src = src
    }
  }, [inView, src, imageSrc])

  return {
    ref,
    imageSrc,
    imageLoaded,
    imageError,
    inView
  }
}