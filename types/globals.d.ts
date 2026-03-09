export {}

// Create a type for the Roles
export type Roles = 'admin' | 'moderator'

declare global {
  interface CustomJwtSessionClaims {
    publicMetadata: {
      role?: Roles
    }
  }
}