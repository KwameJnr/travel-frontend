export interface UserRole {
  userRoleId: number;
  fNumber: string | null;
  roleName: string;
  dateCreated: string;
  lastUpdated: string;
}

export interface CreateUserRoleDto {
  fNumber: string;
  roleName: string;
}