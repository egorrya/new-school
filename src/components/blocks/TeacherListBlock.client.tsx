'use client'

import type { Teacher } from '@/payload-types'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Variants } from 'motion/react'
import { Sparkle, UserRound, X } from 'lucide-react'
import { useId, useState } from 'react'

import { Media } from '@/components/shared/Media'
import RichText from '@/components/shared/RichText'

import { cn } from '@/utilities/ui'
import { useIsMobileViewport } from '@/utilities/useIsMobileViewport'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.22, ease: EASE_OUT } },
}

const modalContentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.22 } },
}

const modalFieldVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_OUT } },
}

const mobileModalShellVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.34, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: 14,
    scale: 0.97,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
}

const morphTransition = { type: 'spring', stiffness: 260, damping: 28 } as const

function cardRevealTransition(index: number) {
  return {
    layout: morphTransition,
    opacity: { duration: 0.55, delay: index * 0.3, ease: EASE_OUT },
    y: { duration: 0.55, delay: index * 0.3, ease: EASE_OUT },
  }
}

function photoLayoutId(groupId: string, teacherId: number) {
  return `${groupId}-photo-${teacherId}`
}

function nameLayoutId(groupId: string, teacherId: number) {
  return `${groupId}-name-${teacherId}`
}

function roleLayoutId(groupId: string, teacherId: number) {
  return `${groupId}-role-${teacherId}`
}

function cardLayoutId(groupId: string, teacherId: number) {
  return `${groupId}-card-${teacherId}`
}

function getPhoto(teacher: Teacher) {
  return teacher.photo && typeof teacher.photo === 'object' ? teacher.photo : null
}

type TeacherPhotoProps = {
  className?: string
  imgClassName?: string
  layoutId?: string
  teacher: Teacher
}

function TeacherPhoto({ className, imgClassName, layoutId, teacher }: TeacherPhotoProps) {
  const photo = getPhoto(teacher)

  return (
    <motion.div
      className={cn('relative overflow-hidden bg-secondary-background filter-none!', className)}
      layoutId={layoutId}
      style={{ filter: 'none' }}
      transition={morphTransition}
    >
      {photo ? (
        <Media
          alt={teacher.name}
          fill
          htmlElement={null}
          imgClassName={cn('h-full w-full object-cover', imgClassName)}
          pictureClassName="absolute inset-0 block h-full w-full"
          resource={photo}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-foreground/25">
          <UserRound aria-hidden="true" className="size-12" strokeWidth={1.25} />
        </div>
      )}
    </motion.div>
  )
}

type TeacherCardProps = {
  groupId: string
  index: number
  isOpen: boolean
  onOpen: () => void
  shouldReduceMotion: boolean
  useSharedLayoutMotion: boolean
  teacher: Teacher
}

function TeacherCard({
  groupId,
  index,
  isOpen,
  onOpen,
  shouldReduceMotion,
  teacher,
  useSharedLayoutMotion,
}: TeacherCardProps) {
  return (
    <motion.button
      className={cn('teacher-card group relative flex flex-col cursor-pointer rounded-base overflow-hidden border-2 border-border bg-background text-left outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2', isOpen && 'pointer-events-none opacity-0')}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      initial={false}
      layoutId={useSharedLayoutMotion ? cardLayoutId(groupId, teacher.id) : undefined}
      transition={cardRevealTransition(index)}
      type="button"
      onClick={onOpen}
    >
      <TeacherPhoto
        className="aspect-4/5 w-full"
        imgClassName="teacher-photo transition-all duration-500 ease-out group-hover:scale-[1.05] filter-none!"
        layoutId={useSharedLayoutMotion ? photoLayoutId(groupId, teacher.id) : undefined}
        teacher={teacher}
      />

      <div className="flex items-start gap-2 px-3 py-3 sm:gap-6 sm:px-6 sm:py-6">
        <Sparkle
          aria-hidden="true"
          className="mt-0.5 size-3 shrink-0 fill-foreground text-foreground transition-transform duration-500 group-hover:rotate-90 sm:size-4"
        />
        <span className="min-w-0">
          <motion.span
            className="block truncate font-heading text-sm leading-tight sm:text-lg"
            layoutId={useSharedLayoutMotion ? nameLayoutId(groupId, teacher.id) : undefined}
            transition={morphTransition}
          >
            {teacher.name}
          </motion.span>
          {teacher.position ? (
            <motion.span
              className="mt-0.5 block text-[0.625rem] leading-tight text-muted-foreground sm:text-sm sm:leading-snug"
              layoutId={useSharedLayoutMotion ? roleLayoutId(groupId, teacher.id) : undefined}
              transition={morphTransition}
            >
              {teacher.position}
            </motion.span>
          ) : null}
        </span>
      </div>
    </motion.button>
  )
}

type TeacherDetailModalProps = {
  groupId: string
  isMobile: boolean
  onOpenChange: (open: boolean) => void
  shouldReduceMotion: boolean
  teacher: Teacher | null
  useSharedLayoutMotion: boolean
}

function TeacherDetailModal({
  groupId,
  isMobile,
  onOpenChange,
  shouldReduceMotion,
  teacher,
  useSharedLayoutMotion,
}: TeacherDetailModalProps) {
  const closeModal = () => onOpenChange(false)
  const presenceMotionProps = shouldReduceMotion
    ? { initial: false as const }
    : { animate: 'visible' as const, exit: 'exit' as const, initial: 'hidden' as const }
  const contentMotionProps = shouldReduceMotion
    ? { initial: false as const }
    : { animate: 'visible' as const, exit: 'hidden' as const, initial: 'hidden' as const }
  const shellMotionProps =
    isMobile && !shouldReduceMotion
      ? { animate: 'visible' as const, exit: 'exit' as const, initial: 'hidden' as const }
      : { exit: shouldReduceMotion ? undefined : { opacity: 1 }, initial: false as const }

  return (
    <DialogPrimitive.Root open={teacher !== null} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {teacher ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                {...presenceMotionProps}
                className="fixed inset-0 z-60 bg-white/80"
                variants={shouldReduceMotion ? undefined : overlayVariants}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount>
              <div
                className="fixed inset-x-0 bottom-0 top-[calc(var(--site-header-fixed-bottom,var(--site-header-height,0px))+0.75rem)] z-60 flex items-start justify-center overflow-y-auto p-4 sm:inset-0 sm:items-center sm:p-6"
                onPointerDown={(event) => {
                  if (event.target === event.currentTarget) {
                    closeModal()
                  }
                }}
              >
                <motion.div
                  {...shellMotionProps}
                  className="relative flex max-h-full w-full max-w-3xl flex-col overflow-y-auto rounded-base border-2 border-border bg-card shadow-shadow sm:max-h-[88vh] sm:flex-row sm:overflow-hidden"
                  layoutId={useSharedLayoutMotion ? cardLayoutId(groupId, teacher.id) : undefined}
                  transition={morphTransition}
                  variants={isMobile && !shouldReduceMotion ? mobileModalShellVariants : undefined}
                  onClick={(event) => event.stopPropagation()}
                >
                  <DialogPrimitive.Close asChild>
                    <motion.button
                      aria-label="Закрыть"
                      className="absolute top-4 right-4 z-10 inline-flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-border bg-white text-foreground transition-transform hover:scale-105 active:scale-95 sm:top-5 sm:right-5"
                      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                      initial={false}
                      onClick={(event) => {
                        event.stopPropagation()
                        closeModal()
                      }}
                      type="button"
                    >
                      <X className="size-4" />
                    </motion.button>
                  </DialogPrimitive.Close>

                  <div className="relative h-64 w-full shrink-0 sm:h-auto sm:w-1/2">
                    <TeacherPhoto
                      className="h-full w-full"
                      layoutId={useSharedLayoutMotion ? photoLayoutId(groupId, teacher.id) : undefined}
                      teacher={teacher}
                    />
                  </div>

                  <motion.div
                    {...contentMotionProps}
                    className="flex flex-col gap-4 p-6 sm:w-1/2 sm:min-h-0 sm:overflow-y-auto sm:p-8"
                    variants={shouldReduceMotion ? undefined : modalContentVariants}
                  >
                    <DialogPrimitive.Title asChild>
                      <motion.h2
                        className="font-heading text-2xl leading-[1.1] sm:text-3xl"
                        layoutId={useSharedLayoutMotion ? nameLayoutId(groupId, teacher.id) : undefined}
                        transition={morphTransition}
                      >
                        {teacher.name}
                      </motion.h2>
                    </DialogPrimitive.Title>

                    {teacher.position ? (
                      <motion.p
                        className="text-sm text-muted-foreground"
                        layoutId={useSharedLayoutMotion ? roleLayoutId(groupId, teacher.id) : undefined}
                        transition={morphTransition}
                      >
                        {teacher.position}
                      </motion.p>
                    ) : null}

                    <DialogPrimitive.Description className="sr-only">
                      {teacher.position || 'Профиль преподавателя'}
                    </DialogPrimitive.Description>

                    {teacher.startYear ? (
                      <motion.p
                        className="text-sm text-muted-foreground"
                        variants={shouldReduceMotion ? undefined : modalFieldVariants}
                      >
                        В школе с {teacher.startYear} года
                      </motion.p>
                    ) : null}

                    <motion.div variants={shouldReduceMotion ? undefined : modalFieldVariants}>
                      {teacher.description ? (
                        <RichText
                          data={teacher.description}
                          enableGutter={false}
                          enableProse
                          className="prose-sm sm:prose-base"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Описание пока не добавлено.
                        </p>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

type TeacherListGridProps = {
  teachers: Teacher[]
}

export function TeacherListGrid({ teachers }: TeacherListGridProps) {
  const groupId = useId()
  const [activeId, setActiveId] = useState<number | null>(null)
  const shouldReduceMotion = useReducedMotion() ?? false
  const isMobile = useIsMobileViewport()
  const useSharedLayoutMotion = !shouldReduceMotion && !isMobile
  const activeTeacher = teachers.find((teacher) => teacher.id === activeId) ?? null

  return (
    <LayoutGroup>
      <div className="teacher-grid">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {teachers.map((teacher, index) => (
            <TeacherCard
              key={teacher.id}
              groupId={groupId}
              index={index}
              isOpen={teacher.id === activeId}
              shouldReduceMotion={shouldReduceMotion}
              teacher={teacher}
              useSharedLayoutMotion={useSharedLayoutMotion}
              onOpen={() => setActiveId(teacher.id)}
            />
          ))}
        </div>
      </div>

      <TeacherDetailModal
        groupId={groupId}
        isMobile={isMobile}
        shouldReduceMotion={shouldReduceMotion}
        teacher={activeTeacher}
        useSharedLayoutMotion={useSharedLayoutMotion}
        onOpenChange={(open) => {
          if (!open) {
            setActiveId(null)
          }
        }}
      />
    </LayoutGroup>
  )
}
