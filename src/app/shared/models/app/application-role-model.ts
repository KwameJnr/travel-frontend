// models/application-role.model.ts
export interface ApplicationRole {
  applicationRoleId?: number;
  name: string;
  permissions?: string;
  dateCreated?: string;
  lastUpdated?: string;
}
