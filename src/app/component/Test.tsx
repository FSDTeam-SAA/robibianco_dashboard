'use client'
import { useSession } from "next-auth/react";
const Test = () => {
      const {data:session}=useSession()
  console.log(session)
  return (
    <div>Test</div>
  )
}

export default Test