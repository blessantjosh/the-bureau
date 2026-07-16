/**
 * Platform-wide role enumeration.
 * Used for RBAC guards and JWT payload claims.
 */
export enum Role {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  RESEARCHER = 'RESEARCHER',
  PATIENT = 'PATIENT',
  VIEWER = 'VIEWER',
}
