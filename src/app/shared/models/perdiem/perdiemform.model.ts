// models/per-diem.model.ts
export interface PerDiemForm {
    id: string;
    location: string; // e.g., country
    rate: number;
    status: string;
    effectiveDate: string;
  }
  