import { UserRole } from "../../config/roles";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  serviceArea?: string | null;
}

export interface UserDocument {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  serviceArea?: string | null;
}
