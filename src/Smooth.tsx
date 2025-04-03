"use client"

import { useEffect, useState, type ReactNode } from "react"
import Lenis from "@studio-freight/lenis"

export interface SmoothScrollProps {
  children: ReactNode
  // Core options
  lerp?: number // Linear interpolation factor (0-1)
  duration?: number // Duration of the scroll animation
  smoothWheel?: boolean // Enable smooth scrolling for mouse wheel
  smoothTouch?: boolean // Enable smooth scrolling for touch devices
  wheelMultiplier?: number // Multiplier for wheel events
  touchMultiplier?: number // Multiplier for touch events
  infinite?: boolean // Enable infinite scrolling
  orientation?: "vertical" | "horizontal" // Scroll orientation
  gestureOrientation?: "vertical" | "horizontal" // Gesture orientation
  // Easing function
  easing?: (t: number) => number
  // Callbacks
  onScroll?: (instance: Lenis) => void
  // Behavior
  smoothWhileScrolling?: boolean // Keep scrolling smooth during user interaction
  syncTouch?: boolean // Sync touch and scroll events
  syncTouchLerp?: number // Lerp factor for touch sync
  // Wrapper and content selectors
  wrapper?: HTMLElement | string | null
  content?: HTMLElement | string | null
  // Accessibility
  wheelEventsTarget?: HTMLElement | Window | null
  eventsTarget?: HTMLElement | Window | null
  preventTouch?: boolean // Prevent touch events
}

const defaultEasing = (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t))

const SmoothScroll = ({
  children,
  lerp = 0.1,
  duration,
  smoothWheel = true,
  smoothTouch = false,
  wheelMultiplier = 1,
  touchMultiplier = 1,
  infinite = false,
  orientation = "vertical",
  gestureOrientation = "vertical",
  easing = defaultEasing,
  onScroll,
  smoothWhileScrolling = false,
  syncTouch = false,
  syncTouchLerp = 0.1,
  wrapper = window,
  content = document.documentElement,
  wheelEventsTarget = window,
  eventsTarget = window,
  preventTouch = false,
}: SmoothScrollProps) => {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  // Initialize Lenis on component mount
  useEffect(() => {
    const lenisInstance = new Lenis({
      lerp,
      duration,
      smoothWheel,
      smoothTouch,
      wheelMultiplier,
      touchMultiplier,
      infinite,
      orientation,
      gestureOrientation,
      easing,
      smoothWhileScrolling,
      syncTouch,
      syncTouchLerp,
      wrapper,
      content,
      wheelEventsTarget,
      eventsTarget,
      preventTouch,
    })

    // Store the instance in state for potential external access
    setLenis(lenisInstance)

    // Set up the animation frame loop
    function raf(time: number) {
      lenisInstance.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Set up scroll callback if provided
    if (onScroll) {
      lenisInstance.on("scroll", onScroll)
    }

    // Cleanup when component unmounts
    return () => {
      lenisInstance.destroy()
      if (onScroll) {
        lenisInstance.off("scroll", onScroll)
      }
    }
  }, [
    lerp,
    duration,
    smoothWheel,
    smoothTouch,
    wheelMultiplier,
    touchMultiplier,
    infinite,
    orientation,
    gestureOrientation,
    easing,
    onScroll,
    smoothWhileScrolling,
    syncTouch,
    syncTouchLerp,
    wrapper,
    content,
    wheelEventsTarget,
    eventsTarget,
    preventTouch,
  ])

  return <>{children}</>
}

export default SmoothScroll

