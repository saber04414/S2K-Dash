'use client'

import { Key } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast';


export default function Login() {
  const [password, setPassword] = useState<string>('')
  const router = useRouter();

  const loginHandler = (e: any) => {
    e.preventDefault()

    if (password === process.env.NEXT_PUBLIC_SECRET) {
      const minutesToExpire = 30;

      const expires = new Date();
      expires.setTime(expires.getTime() + (minutesToExpire * 60 * 1000));

      document.cookie = `${process.env.NEXT_PUBLIC_COOKIE_NAME}=${process.env.NEXT_PUBLIC_COOKIE_VALUE}; expires=${expires.toUTCString()}; path=/`;

      router.push('/dashboard')
    } else {
      toast.error('Wrong password')
    }
  }

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <form
        onSubmit={loginHandler}
        className="flex flex-col items-center justify-center gap-y-10 p-10 w-fit mx-auto"
      >
        <Image src="/mark.png" width={100} height={60} className='w-32 h-32' alt='' />
        <div className='flex flex-col gap-3'>
          <div className='flex flex-row items-center gap-3 border border-slate-800 rounded-md px-2'>
            <Key className='text-white' size={15} />
            <input
              autoFocus
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="text-white py-2 rounded-md bg-transparent decoration-none outline-none border-0"
            />
          </div>
          <button className="text-white px-2 py-2 rounded-md bg-transparent border border-slate-800">Login</button>
        </div>
      </form>
    </main>
  )
}
