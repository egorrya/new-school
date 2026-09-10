'use client'

import type React from 'react'
import { useRef, useState, useCallback, useEffect, useSyncExternalStore } from 'react'

import { cn } from '@/shared/lib/cn'

const HOVER_MEDIA_QUERY = '(hover: hover) and (pointer: fine)'

function subscribeToHoverCapability(onStoreChange: () => void) {
  const query = window.matchMedia(HOVER_MEDIA_QUERY)
  query.addEventListener('change', onStoreChange)

  return () => query.removeEventListener('change', onStoreChange)
}

function getCanHover() {
  return window.matchMedia(HOVER_MEDIA_QUERY).matches
}

function useCanHover() {
  return useSyncExternalStore(subscribeToHoverCapability, getCanHover, () => false)
}

interface MagneticTextProps {
  text: string
  hoverText?: string
  className?: string
  textClassName?: string
}

export function MagneticText({
  text,
  hoverText = text,
  className,
  textClassName = 'text-5xl font-bold tracking-tighter',
}: MagneticTextProps) {
  const canHover = useCanHover()
  const containerRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const innerTextRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const mousePos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!canHover) {
      return
    }

    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [canHover])

  useEffect(() => {
    if (!canHover || !isHovered) {
      return
    }

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor

    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.15)
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.15)

      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px) translate(-50%, -50%)`
      }

      if (innerTextRef.current) {
        innerTextRef.current.style.transform = `translate(${-currentPos.current.x}px, ${-currentPos.current.y}px)`
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [canHover, isHovered])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }, [])

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mousePos.current = { x, y }
    currentPos.current = { x, y }
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center select-none',
        canHover && 'cursor-pointer',
        className,
      )}
      onMouseEnter={canHover ? handleMouseEnter : undefined}
      onMouseLeave={canHover ? handleMouseLeave : undefined}
      onMouseMove={canHover ? handleMouseMove : undefined}
      ref={containerRef}
    >
      <span className={cn('text-foreground', textClassName)}>{text}</span>

      {canHover ? (
        <div
          className="absolute top-0 left-0 pointer-events-none overflow-hidden rounded-full bg-foreground"
          ref={circleRef}
          style={{
            width: isHovered ? 150 : 0,
            height: isHovered ? 150 : 0,
            transition:
              'width 0.5s cubic-bezier(0.33, 1, 0.68, 1), height 0.5s cubic-bezier(0.33, 1, 0.68, 1)',
            willChange: 'transform, width, height',
          }}
        >
          <div
            className="absolute flex items-center justify-center"
            ref={innerTextRef}
            style={{
              width: containerSize.width,
              height: containerSize.height,
              top: '50%',
              left: '50%',
              willChange: 'transform',
            }}
          >
            <span className={cn('whitespace-nowrap text-background', textClassName)}>
              {hoverText}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
