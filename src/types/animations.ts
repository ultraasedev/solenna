/*
  Fichier: src/types/animations.ts
  Types spécifiques aux animations GSAP et Framer Motion pour Solena
*/

import { gsap } from 'gsap'

// Configuration de base pour les animations GSAP
export interface GSAPAnimationConfig {
  duration: number
  delay?: number
  ease?: string
  repeat?: number
  yoyo?: boolean
  stagger?: number
  onComplete?: () => void
  onStart?: () => void
  onUpdate?: () => void
}

// Configuration ScrollTrigger
export interface ScrollTriggerConfig {
  trigger: string | HTMLElement
  start?: string
  end?: string
  scrub?: boolean | number
  pin?: boolean | string
  pinSpacing?: boolean
  snap?: boolean | number | any[]
  toggleActions?: string
  toggleClass?: string
  markers?: boolean
  onEnter?: () => void
  onLeave?: () => void
  onEnterBack?: () => void
  onLeaveBack?: () => void
  onUpdate?: (self: any) => void
  onToggle?: (self: any) => void
  onRefresh?: (self: any) => void
  refreshPriority?: number
  invalidateOnRefresh?: boolean
}

// Types d'animations prédéfinies
export type AnimationType = 
  | 'fadeIn'
  | 'fadeOut'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'scaleOut'
  | 'rotateIn'
  | 'rotateOut'
  | 'bounceIn'
  | 'bounceOut'
  | 'flipIn'
  | 'flipOut'
  | 'zoomIn'
  | 'zoomOut'

// Configuration pour animations de base
export interface BaseAnimationConfig extends GSAPAnimationConfig {
  type: AnimationType
  target: string | HTMLElement | HTMLElement[]
  scrollTrigger?: ScrollTriggerConfig
}

// Animation de texte (révélation de caractères)
export interface TextAnimationConfig extends GSAPAnimationConfig {
  type: 'typewriter' | 'reveal' | 'split' | 'wave'
  text: string
  target: string | HTMLElement
  splitBy: 'chars' | 'words' | 'lines'
  stagger?: number
  mask?: boolean
}

// Animation de compteur
export interface CounterAnimationConfig extends GSAPAnimationConfig {
  startValue: number
  endValue: number
  target: string | HTMLElement
  format?: (value: number) => string
  separator?: string
  decimals?: number
  prefix?: string
  suffix?: string
}

// Animation de parallax
export interface ParallaxConfig {
  target: string | HTMLElement
  speed: number
  direction: 'vertical' | 'horizontal'
  offset?: number
  bounds?: {
    min: number
    max: number
  }
}

// Animation de morphing (SVG)
export interface MorphAnimationConfig extends GSAPAnimationConfig {
  from: string // SVG path
  to: string // SVG path
  target: string | SVGPathElement
  shapeIndex?: number
}

// Configuration pour animations de cartes
export interface CardAnimationConfig extends GSAPAnimationConfig {
  target: string | HTMLElement
  hoverEffect: boolean
  clickEffect: boolean
  entrance: AnimationType
  exit?: AnimationType
  stagger?: number
  perspective?: number
  transformOrigin?: string
}

// Animation de navigation
export interface NavigationAnimationConfig {
  menu: {
    target: string | HTMLElement
    type: 'slide' | 'fade' | 'scale' | 'morphing'
    direction?: 'top' | 'bottom' | 'left' | 'right'
    duration: number
    ease: string
  }
  links: {
    stagger: number
    type: AnimationType
    hover: {
      scale?: number
      color?: string
      duration: number
    }
  }
  mobile: {
    hamburger: {
      target: string | HTMLElement
      morphing: boolean
      duration: number
    }
    overlay: {
      type: 'slide' | 'fade'
      duration: number
      ease: string
    }
  }
}

// Configuration pour animations de formulaire
export interface FormAnimationConfig {
  fields: {
    entrance: AnimationType
    stagger: number
    validation: {
      success: AnimationType
      error: AnimationType
      duration: number
    }
  }
  submit: {
    loading: {
      type: 'spinner' | 'pulse' | 'dots'
      duration: number
    }
    success: {
      type: AnimationType
      duration: number
      message: boolean
    }
    error: {
      type: 'shake' | 'bounce' | 'flash'
      duration: number
      intensity: number
    }
  }
}

// Timeline GSAP complexe
export interface TimelineConfig {
  id: string
  autoplay: boolean
  repeat?: number
  repeatDelay?: number
  yoyo?: boolean
  paused?: boolean
  onComplete?: () => void
  onRepeat?: () => void
  onReverseComplete?: () => void
  steps: TimelineStep[]
}

// Étape de timeline
export interface TimelineStep {
  id: string
  target: string | HTMLElement | HTMLElement[]
  animation: GSAPAnimationConfig
  position?: string | number
  label?: string
}

// Configuration pour page transitions
export interface PageTransitionConfig {
  enter: {
    initial: any
    animate: any
    exit: any
    transition: {
      duration: number
      ease: string
      staggerChildren?: number
    }
  }
  page: {
    variants: {
      initial: any
      enter: any
      exit: any
    }
    transition: {
      type: string
      duration: number
    }
  }
}

// Configuration des animations par section
export interface SectionAnimationConfig {
  hero: {
    title: TextAnimationConfig
    subtitle: BaseAnimationConfig
    cta: BaseAnimationConfig
    background: ParallaxConfig
    cards: CardAnimationConfig[]
  }
  pathologies: {
    title: BaseAnimationConfig
    cards: CardAnimationConfig
    stats: CounterAnimationConfig[]
  }
  pricing: {
    title: BaseAnimationConfig
    cards: CardAnimationConfig
    comparison: BaseAnimationConfig
  }
  simulator: {
    form: FormAnimationConfig
    result: BaseAnimationConfig
    calculator: CounterAnimationConfig
  }
  footer: {
    links: BaseAnimationConfig
    social: BaseAnimationConfig
    newsletter: FormAnimationConfig
  }
}

// Presets d'animations courantes
export interface AnimationPresets {
  entrance: {
    gentle: BaseAnimationConfig
    dynamic: BaseAnimationConfig
    elegant: BaseAnimationConfig
    playful: BaseAnimationConfig
  }
  hover: {
    subtle: GSAPAnimationConfig
    prominent: GSAPAnimationConfig
    bouncy: GSAPAnimationConfig
  }
  loading: {
    spinner: GSAPAnimationConfig
    pulse: GSAPAnimationConfig
    skeleton: GSAPAnimationConfig
  }
  notification: {
    success: BaseAnimationConfig
    error: BaseAnimationConfig
    warning: BaseAnimationConfig
    info: BaseAnimationConfig
  }
}

// Configuration responsive pour animations
export interface ResponsiveAnimationConfig {
  mobile: BaseAnimationConfig
  tablet: BaseAnimationConfig
  desktop: BaseAnimationConfig
  largeDesktop: BaseAnimationConfig
}

// Performance et optimisation
export interface AnimationPerformanceConfig {
  reduceMotion: boolean
  preferReducedMotion: boolean
  gpuAcceleration: boolean
  willChange: boolean
  force3D: boolean
  autoKill: boolean
  lazy: boolean
}

// Debug et développement
export interface AnimationDebugConfig {
  showMarkers: boolean
  logPerformance: boolean
  visualizeTimelines: boolean
  slowMotion: number
  enableDevTools: boolean
}

// Configuration globale des animations
export interface GlobalAnimationConfig {
  performance: AnimationPerformanceConfig
  debug: AnimationDebugConfig
  presets: AnimationPresets
  sections: SectionAnimationConfig
  responsive: ResponsiveAnimationConfig
  gsap: {
    config: {
      nullTargetWarn: boolean
      units: {
        left: string
        top: string
        rotation: string
      }
    }
    defaults: GSAPAnimationConfig
  }
}

// Hook d'animation personnalisé
export interface UseAnimationHook {
  ref: React.RefObject<HTMLElement>
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
  timeline?: gsap.core.Timeline
}

// Gestionnaire d'animations global
export interface AnimationManager {
  register: (id: string, config: BaseAnimationConfig) => void
  unregister: (id: string) => void
  play: (id: string) => void
  pause: (id: string) => void
  kill: (id: string) => void
  killAll: () => void
  getTimeline: (id: string) => gsap.core.Timeline | undefined
  setGlobalConfig: (config: Partial<GlobalAnimationConfig>) => void
  enableReducedMotion: (enabled: boolean) => void
}

// Types pour les événements d'animation
export type AnimationEvent = 
  | 'start'
  | 'complete'
  | 'reverse'
  | 'pause'
  | 'resume'
  | 'kill'
  | 'update'

export interface AnimationEventData {
  id: string
  type: AnimationEvent
  progress: number
  duration: number
  timestamp: number
  target: HTMLElement | HTMLElement[]
}

// Callback pour événements d'animation
export type AnimationEventCallback = (data: AnimationEventData) => void

// Interface pour plugin d'animation personnalisé
export interface AnimationPlugin {
  name: string
  version: string
  register: (gsap: any) => void
  config?: any
  dependencies?: string[]
}