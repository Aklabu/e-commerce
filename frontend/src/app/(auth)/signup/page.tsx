import Signup from '@/components/authentication/Signup'
import React from 'react'

export const metadata = {
  title: "Sign up | Ecommerce",
  description:"Sign up and create your account to explore our proucts",
  keywords: [
    "Eccomerce",
    "Electronic",
    "Solar System",
    "Battery"
  ]
}

const SignupPage = () => {
  return (
    <div>
      <Signup/>
    </div>
  )
}

export default SignupPage
