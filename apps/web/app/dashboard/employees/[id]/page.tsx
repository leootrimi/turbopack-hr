import React from 'react'
import UserProfile from '../../../../features/employees/components/profile/profile'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <UserProfile id={id} />
  )
}

export default page
