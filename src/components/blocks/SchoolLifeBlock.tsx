import type { SchoolLifeBlock as SchoolLifeBlockType } from '@/payload-types'

import { SchoolLifeDivider } from '@/components/blocks/SchoolLifeDivider.client'
import { SchoolLifeMark } from '@/components/blocks/SchoolLifeMark.client'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { PageBlockContainer, PageBlockSection } from '@/components/shared/PageBlock'

export function SchoolLifeBlock({ description, title }: SchoolLifeBlockType) {
  return (
    <PageBlockSection className="py-14 sm:py-20 lg:py-28">
      <PageBlockContainer>
        <MotionReveal duration={0.56} y={24}>
          <h2 className="font-heading text-[clamp(2.5rem,4.7vw,4.5rem)] leading-[0.98] tracking-[-0.045em] whitespace-pre-line uppercase text-[var(--school-black)]">
            {title}
          </h2>
        </MotionReveal>

        <div className="mt-9 sm:mt-12 lg:mt-16">
          <SchoolLifeDivider />

          <div className="pt-8 sm:pt-12 lg:pt-16">
            <div className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(12rem,1fr)_minmax(0,2fr)] lg:gap-16">
              <MotionReveal delay={0.08} duration={0.42} y={18}>
                <SchoolLifeMark />
              </MotionReveal>

              <MotionReveal delay={0.18} duration={0.58} y={26}>
                <p className="max-w-3xl text-lg leading-relaxed font-light text-[var(--school-black)] sm:text-xl lg:text-2xl">
                  {description}
                </p>
              </MotionReveal>
            </div>
          </div>
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
