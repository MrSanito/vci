import { Roles } from '@/types/globals'
import { auth } from '@clerk/nextjs/server'

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth()
  // @ts-ignore - Clerk stores role in metadata, not publicMetadata in sessionClaims
  return sessionClaims?.metadata?.role === role
}