import Link from 'next/link'

import { MagneticText } from '@/shared/ui/primitives/magnetic-text'
import { MotionReveal } from '@/shared/components/MotionReveal'
import { PageBlockContainer, PageBlockSection } from '@/shared/components/PageBlock'
import { getCachedGlobal } from '@/server/payload/getGlobals'
import { resolveHref } from '@/shared/lib/resolveNavigationHref'

const ABOUT_NAV_LABEL = 'о нас'

const linkTextClassName = 'font-heading text-lg sm:text-xl lg:text-2xl'

export async function AboutLinksBlock() {
  const header = await getCachedGlobal('header', 1)()
  const aboutNavItem = header.navigationLinks?.find(
    (item) => item.link.label?.trim().toLowerCase() === ABOUT_NAV_LABEL,
  )

  const links = (aboutNavItem?.subLinks ?? [])
    .map((subItem) => ({
      id: subItem.id,
      label: subItem.link.label,
      href: resolveHref(subItem.link),
      newTab: subItem.link.newTab,
    }))
    .filter((link) => link.href && link.href !== '/')

  if (links.length === 0) {
    return null
  }

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <nav
          aria-label="О нас"
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14"
        >
          {links.map((link, index) => {
            const isExternal =
              link.href.startsWith('http') ||
              link.href.startsWith('mailto:') ||
              link.href.startsWith('tel:')

            const content = (
              <MagneticText
                hoverText={link.label}
                text={link.label}
                textClassName={linkTextClassName}
              />
            )

            return (
              <MotionReveal delay={index * 0.08} key={link.id || link.label} y={12}>
                {isExternal ? (
                  <a
                    href={link.href}
                    rel={link.newTab ? 'noopener noreferrer' : undefined}
                    target={link.newTab ? '_blank' : undefined}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    rel={link.newTab ? 'noopener noreferrer' : undefined}
                    target={link.newTab ? '_blank' : undefined}
                  >
                    {content}
                  </Link>
                )}
              </MotionReveal>
            )
          })}
        </nav>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
