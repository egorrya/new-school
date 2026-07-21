import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container py-24 sm:py-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <p className="text-sm font-medium text-foreground/60">Ошибка 404</p>
        <h1 className="text-4xl font-heading sm:text-5xl">Страница не найдена</h1>
        <p className="max-w-2xl text-base leading-relaxed text-foreground/75">
          Похоже, ссылка устарела или страница ещё не опубликована.
        </p>

        <Button asChild variant="default">
          <Link href="/">На главную</Link>
        </Button>
      </div>
    </div>
  )
}
