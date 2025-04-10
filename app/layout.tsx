import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: '',
  description: 'Created by 0xsid0703',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 flex flex-row`}
      >
        <AuthProvider>{children}
          <div><Toaster position="bottom-right" reverseOrder={false} /></div>
        </AuthProvider>
      </body>
    </html>
  )
}
