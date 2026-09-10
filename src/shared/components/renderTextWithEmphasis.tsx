import type { ReactNode } from 'react'

import { TextEmphasis } from '@/shared/components/TextEmphasis'

/** Wraps the first occurrence of `emphasis` inside `text` with an animated underline. */
export function renderTextWithEmphasis(
  text: string,
  emphasis?: string | null,
  options?: { delay?: number },
): ReactNode {
  if (!emphasis) {
    return text
  }

  const matchIndex = text.indexOf(emphasis)

  if (matchIndex === -1) {
    return text
  }

  const before = text.slice(0, matchIndex)
  const match = text.slice(matchIndex, matchIndex + emphasis.length)
  const after = text.slice(matchIndex + emphasis.length)

  return (
    <>
      {before}
      <TextEmphasis delay={options?.delay}>{match}</TextEmphasis>
      {after}
    </>
  )
}
