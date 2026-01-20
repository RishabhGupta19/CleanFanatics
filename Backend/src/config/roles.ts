export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PROVIDER = "PROVIDER",
  ADMIN = "ADMIN"
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  CUSTOMER: 1,
  PROVIDER: 2,
  ADMIN: 3
};
