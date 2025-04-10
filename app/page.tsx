'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const [password, setPassword] = useState<string>('')
  const router = useRouter();

  const loginHandler = (e: any) => {
    e.preventDefault()

    if (password === process.env.NEXT_PUBLIC_SECRET) {
      console.log('Correct password')

      const minutesToExpire = 30;

      const expires = new Date();
      expires.setTime(expires.getTime() + (minutesToExpire * 60 * 1000));

      document.cookie = `${process.env.NEXT_PUBLIC_COOKIE_NAME}=${process.env.NEXT_PUBLIC_COOKIE_VALUE}; expires=${expires.toUTCString()}; path=/`;

      router.push('/dashboard')
    } else {
      alert('Wrong password')
    }
  }

  return (
    <main className="w-full">
      <h1 className="pt-20 text-center font-semibold text-3xl">Login</h1>
      <form
        onSubmit={loginHandler}
        className="flex flex-col items-center mt-20 gap-y-5 p-10 rounded border border-white/10 w-fit mx-auto"
      >
        <input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="text-black px-2"
        />
        <button>Login</button>
      </form>
    </main>
  )
}
