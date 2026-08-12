const SCROLL_TARGET_GAP_PX = 32

function getFixedHeaderBottom(rootStyles: CSSStyleDeclaration, rootFontSize: number) {
  const fixedBottomRaw = rootStyles.getPropertyValue('--site-header-fixed-bottom').trim()
  const fixedBottom = Number.parseFloat(fixedBottomRaw)

  if (Number.isFinite(fixedBottom) && fixedBottom > 0) {
    return fixedBottom
  }

  return (Number.parseFloat(rootStyles.getPropertyValue('--site-header-height')) || 0) * rootFontSize
}

function getTabsNavHeight(rootStyles: CSSStyleDeclaration) {
  const tabsNavHeight = Number.parseFloat(
    rootStyles.getPropertyValue('--site-tabs-nav-height').trim(),
  )

  return Number.isFinite(tabsNavHeight) ? tabsNavHeight : 0
}

export function getTabsScrollOffset(extraGap = 0) {
  const rootStyles = window.getComputedStyle(document.documentElement)
  const rootFontSize = Number.parseFloat(rootStyles.fontSize) || 16

  return getFixedHeaderBottom(rootStyles, rootFontSize) + getTabsNavHeight(rootStyles) + extraGap
}

export function scrollToTabSection(id: string, shouldReduceMotion: boolean) {
  const section = document.getElementById(id)

  if (!section) {
    return
  }

  window.scrollTo({
    behavior: shouldReduceMotion ? 'auto' : 'smooth',
    top: Math.max(
      0,
      section.getBoundingClientRect().top + window.scrollY - getTabsScrollOffset(SCROLL_TARGET_GAP_PX),
    ),
  })
}
