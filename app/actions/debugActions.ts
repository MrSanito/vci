'use server'

import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function checkCurrentUserRole() {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    return { 
      success: false, 
      message: 'Not authenticated',
      userId: null,
      sessionClaims: null,
      userMetadata: null
    };
  }

  // Get full user data from Clerk
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  return {
    success: true,
    userId,
    // @ts-ignore
    sessionClaimsRole: sessionClaims?.publicMetadata?.role,
    sessionClaims: sessionClaims,
    userPublicMetadata: user.publicMetadata,
    userPrivateMetadata: user.privateMetadata,
  };
}
