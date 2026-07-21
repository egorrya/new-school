import { Button } from '@/components/ui/button'
import { getDocumentHref } from '@/utilities/getDocumentHref'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

type ButtonStyles = React.ComponentProps<typeof Button>
type CMSLinkAppearance = 'inline' | 'default' | 'outline' | 'link'

type CMSLinkType = {
  appearance?: CMSLinkAppearance | null
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: string
    value: {
      slug?: string | null
    } | string | number
  } | null
  size?: ButtonStyles['size'] | 'clear' | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object'
      ? getDocumentHref(reference.relationTo, reference.value.slug)
      : url

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button
      asChild
      className={className}
      size={size as ButtonStyles['size']}
      variant={appearance === 'link' ? 'default' : (appearance as ButtonStyles['variant'])}
    >
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
