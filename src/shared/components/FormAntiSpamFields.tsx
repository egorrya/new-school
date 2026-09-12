'use client'

import { useEffect, useRef } from 'react'

export function FormAntiSpamFields() {
  const startedAtRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (startedAtRef.current) {
      startedAtRef.current.value = String(Date.now())
    }
  }, [])

  return (
    <>
      <input defaultValue="" name="formStartedAt" ref={startedAtRef} type="hidden" />
      <label aria-hidden="true" style={{ left: '-10000px', position: 'absolute' }}>
        Не заполняйте это поле
        <input autoComplete="off" name="website" tabIndex={-1} type="text" />
      </label>
    </>
  )
}
