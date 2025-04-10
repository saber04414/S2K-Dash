'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift()!
  return null
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // This runs only on the client after the component has mounted
    setIsMounted(true)

    // check cookie
    const cookie_value = getCookie(process.env.NEXT_PUBLIC_COOKIE_NAME || '') // replace 'token' with your cookie name
    if (cookie_value === process.env.NEXT_PUBLIC_COOKIE_VALUE) {
      // okay
    } else {
      router.push('/')
    }
  }, [])

  if (!isMounted) {
    // Optionally return null or a loader during SSR / before hydration
    return null
  }

  return <>{children}</>
}
