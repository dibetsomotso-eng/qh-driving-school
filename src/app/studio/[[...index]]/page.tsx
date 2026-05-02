'use client'

import dynamic from 'next/dynamic'

// Force EVERYTHING related to Sanity to be client-side only
const StudioApp = dynamic(
  () => import('./StudioComponent'),
  { ssr: false }
)

export default function StudioPage() {
  return <StudioApp />
}
