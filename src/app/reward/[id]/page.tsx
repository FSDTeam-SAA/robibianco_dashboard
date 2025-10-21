import SpinResultPage from '@/components/dashboard/pirze/reward-prize'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SpinResultPage/>
    </Suspense>
  )
}
