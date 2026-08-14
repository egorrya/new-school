'use client'

import type { Teacher } from '@/payload-types'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Variants } from 'motion/react'
import { Sparkle, UserRound, X } from 'lucide-react'
import { useId, useState } from 'react'

import { Media } from '@/components/shared/Media'
import RichText from '@/components/shared/RichText'
import { modalOverlayClassName } from '@/components/ui/modal'

import { cn } from '@/utilities/ui'
import { getIsMobileViewportSync, useIsMobileViewport } from '@/utilities/useIsMobileViewport'

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

// Stable references (not recreated per render): `viewport` and `whileInView`
// are reactive props Motion's useInView tracks in its own effects, so a
// fresh object identity on every render — which a `{...}` literal inline in
// JSX always is, even with identical values — can tear down and recreate
// the IntersectionObserver on every unrelated re-render of this card (e.g.
// every state change from another card's own open/close cycle). A newly
// (re)connected observer has no data for a beat, which read as "left the
// viewport" and replayed the hidden entrance state on cards nowhere near
// actually leaving view.
const cardRevealViewport = { amount: 0.12, margin: '-10% 0px -10% 0px', once: false }
const cardRevealVisibleState = { opacity: 1, y: 0 }

function cardRevealTransition(index: number) {
  return {
    opacity: { duration: 0.5, delay: index * 0.12, ease: EASE_OUT },
    y: { duration: 0.5, delay: index * 0.12, ease: EASE_OUT },
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
  const shouldReduceMotion = useReducedMotion() ?? false

  const content = photo ? (
    <Media
      alt={teacher.name}
      fill
      htmlElement={null}
      imgClassName={cn('h-full w-full object-cover', imgClassName)}
      loading="eager"
      // Card, placeholder, and modal each mount a fresh <img> for this same
      // photo. ImageMedia has its own opacity fade-in, meant to skip itself
      // once the browser reports the image already `complete` — but per the
      // HTML spec that flag isn't guaranteed synchronous even for a cached
      // src, so on a brand-new node it reliably plays the full fade anyway,
      // fighting whatever's already animating this element below (Motion's
      // layoutId crossfade here, or our own fade wrapper on mobile).
      // Disabling it here means exactly one thing owns this photo's opacity.
      disableFadeIn
      pictureClassName="absolute inset-0 block h-full w-full"
      resource={photo}
    />
  ) : (
    <div className="absolute inset-0 flex items-center justify-center text-foreground/25">
      <UserRound aria-hidden="true" className="size-12" strokeWidth={1.25} />
    </div>
  )

  return (
    <motion.div
      className={cn('relative bg-secondary-background filter-none!', className)}
      layout={layoutId ? true : undefined}
      layoutId={layoutId}
      style={{ filter: 'none' }}
      transition={morphTransition}
    >
      {layoutId ? (
        // Card, placeholder, and modal all render this same real photo under
        // a shared layoutId, so Motion's own crossfade already blends the
        // content smoothly on its own — a second, independently-timed fade
        // here would just double up against it and read as a flicker.
        content
      ) : (
        // No shared layoutId here (mobile / reduced motion) means nothing
        // else is smoothing this element's appearance, so mask its own
        // mount with a quick fade instead of a raw pop.
        <motion.div
          animate={{ opacity: 1 }}
          className="absolute inset-0"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE_OUT }}
        >
          {content}
        </motion.div>
      )}
    </motion.div>
  )
}

type TeacherCardProps = {
  groupId: string
  index: number
  isPlaceholder: boolean
  onOpen: () => void
  teacher: Teacher
  useSharedLayoutMotion: boolean
}

function TeacherCard({
  groupId,
  index,
  isPlaceholder,
  onOpen,
  teacher,
  useSharedLayoutMotion,
}: TeacherCardProps) {
  // Resolved once, synchronously, on this card's first real (client) render
  // — not via the SSR-safe useIsMobileViewport hook, which must guess
  // "mobile" on the server and correct itself a render later. Motion only
  // reads `initial`/`whileInView` at mount, so that later correction can't
  // turn a skipped reveal back on, and the entrance never plays on desktop.
  const [isMobileAtMount] = useState(getIsMobileViewportSync)
  const revealY = isMobileAtMount ? 10 : 22
  // This card stays mounted for its whole open → closing → returned cycle —
  // TeacherListGrid only gives it a fresh key (forcing a real remount) the
  // *next* time it's opened (see `openGenerations` there). So it never hands
  // off to/from a separate placeholder component, keeping this element's
  // projection node continuously alive: Motion always has a previous box to
  // morph the shared layoutId from/to, on the very first open included, with
  // no handoff moment left where content could pop or crossfade against
  // nothing.
  //
  // Every *fresh mount* of this component happens to start out as a
  // placeholder (that's the whole point of the key bump on open), so an
  // instance that starts that way should never also play the plain
  // scroll-entrance fade — frozen here since `isPlaceholder` later flips
  // back to false on the same instance once the modal closes, and unlike
  // `initial` (mount-only), `whileInView` is reactive to that.
  const [revealDisabled] = useState(isPlaceholder)

  return (
    // The scroll-entrance reveal (initial/whileInView/viewport) lives on
    // this outer, non-layout-tracked wrapper — kept apart from the inner
    // button's `layout`/`layoutId`. Motion's viewport tracking on a node
    // that's *also* under active layout/projection tracking (as every
    // TeacherCard is, sharing a LayoutGroup with the card currently
    // morphing into/out of the modal) intermittently misreported an
    // in-view card as having just left the viewport whenever a sibling's
    // layoutId transition ran, snapping it back to its hidden entrance
    // state. Splitting the two concerns across separate elements avoids
    // that cross-talk.
    <motion.div
      initial={revealDisabled ? false : { opacity: 0, y: revealY }}
      transition={cardRevealTransition(index)}
      viewport={cardRevealViewport}
      whileInView={revealDisabled ? undefined : cardRevealVisibleState}
    >
      <motion.button
        aria-hidden={isPlaceholder || undefined}
        className={cn(
          'teacher-card group relative flex flex-col cursor-pointer bg-transparent text-left outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2',
          isPlaceholder && 'pointer-events-none',
          isPlaceholder && !useSharedLayoutMotion && 'opacity-0',
        )}
        layout={useSharedLayoutMotion}
        layoutId={useSharedLayoutMotion ? cardLayoutId(groupId, teacher.id) : undefined}
        tabIndex={isPlaceholder ? -1 : undefined}
        transition={morphTransition}
        type="button"
        onClick={isPlaceholder ? undefined : () => onOpen()}
      >
        <div className="relative overflow-hidden">
          <TeacherPhoto
            className="aspect-4/5 w-full"
            imgClassName="teacher-photo origin-center transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.12] filter-none!"
            layoutId={useSharedLayoutMotion ? photoLayoutId(groupId, teacher.id) : undefined}
            teacher={teacher}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#222]/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          />
        </div>

        <div className="flex items-start gap-2 px-3 py-3 sm:gap-6 sm:px-6 sm:py-6">
          <Sparkle
            aria-hidden="true"
            className="mt-0.5 size-3 shrink-0 fill-foreground text-foreground transition-transform duration-500 group-hover:rotate-90 sm:size-4"
          />
          <span className="min-w-0">
            <motion.span
              className="block truncate font-heading text-sm leading-tight sm:text-lg"
              layout={useSharedLayoutMotion}
              layoutId={useSharedLayoutMotion ? nameLayoutId(groupId, teacher.id) : undefined}
              transition={morphTransition}
            >
              {teacher.name}
            </motion.span>
            {teacher.position ? (
              <motion.span
                className="mt-0.5 block text-[0.625rem] leading-tight text-muted-foreground sm:text-sm sm:leading-snug"
                layout={useSharedLayoutMotion}
                layoutId={useSharedLayoutMotion ? roleLayoutId(groupId, teacher.id) : undefined}
                transition={morphTransition}
              >
                {teacher.position}
              </motion.span>
            ) : null}
          </span>
        </div>
      </motion.button>
    </motion.div>
  )
}

type TeacherDetailModalProps = {
  groupId: string
  isMobile: boolean
  onExited: () => void
  onOpenChange: (open: boolean) => void
  shouldReduceMotion: boolean
  teacher: Teacher | null
  useSharedLayoutMotion: boolean
}

function TeacherDetailModal({
  groupId,
  isMobile,
  onExited,
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
      : useSharedLayoutMotion
        ? { animate: 'visible' as const, exit: 'exit' as const, initial: 'hidden' as const }
      : { exit: shouldReduceMotion ? undefined : { opacity: 1 }, initial: false as const }

  return (
    <DialogPrimitive.Root open={teacher !== null} onOpenChange={onOpenChange}>
      <AnimatePresence onExitComplete={onExited}>
        {teacher ? (
          <DialogPrimitive.Portal forceMount key={teacher.id}>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                {...presenceMotionProps}
                className={modalOverlayClassName}
                variants={shouldReduceMotion ? undefined : overlayVariants}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className="fixed inset-x-0 bottom-0 top-[calc(var(--site-header-fixed-bottom,var(--site-header-height,0px))+0.75rem)] z-100 flex items-start justify-center overflow-y-auto p-4 sm:inset-0 sm:items-center sm:p-6"
                onPointerDown={(event) => {
                  if (event.target === event.currentTarget) {
                    closeModal()
                  }
                }}
              >
                <motion.div
                  {...shellMotionProps}
                  className="relative flex max-h-full w-full max-w-3xl flex-col overflow-y-auto rounded-base border border-border bg-card shadow-shadow sm:max-h-[88vh] sm:flex-row sm:overflow-hidden"
                  layout={useSharedLayoutMotion}
                  layoutId={useSharedLayoutMotion ? cardLayoutId(groupId, teacher.id) : undefined}
                  transition={morphTransition}
                  variants={
                    isMobile && !shouldReduceMotion
                      ? mobileModalShellVariants
                      : useSharedLayoutMotion
                        ? overlayVariants
                        : undefined
                  }
                  onClick={(event) => event.stopPropagation()}
                >
                  <DialogPrimitive.Close asChild>
                    <motion.button
                      aria-label="Закрыть"
                      className="absolute top-4 right-4 z-10 inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-white text-foreground transition-transform hover:scale-105 active:scale-95 sm:top-5 sm:right-5"
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
                        layout={useSharedLayoutMotion}
                        layoutId={useSharedLayoutMotion ? nameLayoutId(groupId, teacher.id) : undefined}
                        transition={morphTransition}
                      >
                        {teacher.name}
                      </motion.h2>
                    </DialogPrimitive.Title>

                    {teacher.position ? (
                      <motion.p
                        className="text-sm text-muted-foreground"
                        layout={useSharedLayoutMotion}
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
              </motion.div>
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
  const reactId = useId()
  const groupId = `teacher-list-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const [activeId, setActiveId] = useState<number | null>(null)
  const [closingId, setClosingId] = useState<number | null>(null)
  // Bumped per-teacher every time that teacher is opened, and folded into
  // that card's `key` below. TeacherCard stays mounted across its whole
  // open → closing → returned cycle (no more separate placeholder
  // component to hand off to/from) — the only time it actually needs a
  // fresh instance is at the *start* of a new open, so Motion has a
  // previous box to pair the modal's shared layoutId against. Bumping the
  // key precisely there (and nowhere else) forces exactly that remount.
  const [openGenerations, setOpenGenerations] = useState<Record<number, number>>({})
  const shouldReduceMotion = useReducedMotion() ?? false
  const isMobile = useIsMobileViewport()
  const useSharedLayoutMotion = !shouldReduceMotion && !isMobile
  const activeTeacher = teachers.find((teacher) => teacher.id === activeId) ?? null

  const openTeacher = (teacherId: number) => {
    setActiveId(teacherId)
    setOpenGenerations((prev) => ({ ...prev, [teacherId]: (prev[teacherId] ?? 0) + 1 }))
  }

  return (
    <LayoutGroup id={groupId}>
      <div className="teacher-grid">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {teachers.map((teacher, index) => {
            const isPlaceholder = useSharedLayoutMotion
              ? teacher.id === activeId || teacher.id === closingId
              : teacher.id === activeId
            const cardKey = useSharedLayoutMotion
              ? `${teacher.id}-${openGenerations[teacher.id] ?? 0}`
              : teacher.id

            return (
              <TeacherCard
                key={cardKey}
                groupId={groupId}
                index={index}
                isPlaceholder={isPlaceholder}
                teacher={teacher}
                useSharedLayoutMotion={useSharedLayoutMotion}
                onOpen={() => openTeacher(teacher.id)}
              />
            )
          })}
        </div>
      </div>

      <TeacherDetailModal
        groupId={groupId}
        isMobile={isMobile}
        shouldReduceMotion={shouldReduceMotion}
        teacher={activeTeacher}
        useSharedLayoutMotion={useSharedLayoutMotion}
        onExited={() => setClosingId(null)}
        onOpenChange={(open) => {
          if (!open) {
            setClosingId(activeId)
            setActiveId(null)
          }
        }}
      />
    </LayoutGroup>
  )
}
