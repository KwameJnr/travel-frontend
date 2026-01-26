export interface UserRole {
  userRoleId: number;
  fNumber: string | null;
  fnumber?: string | null;
  roleName: string;
  dateCreated: string;
  lastUpdated: string;
}

export interface CreateUserRoleDto {
  fNumber: string;
  fnumber?: string;
  roleName: string;
}