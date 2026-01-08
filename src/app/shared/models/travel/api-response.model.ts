export interface ApiResponse<T> {
    statusCode: number;
    statusMessage: string;
    serverTimestamp: string;
    data: T;
  }
  
  export interface ApiResponseRec<T> {
    statusCode: number;
    statusMessage: string;
    serverTimestamp: string;
    pageNumber: number;
    recordCount: number;
    totalRecords: number;
    totalPages: number;
    records: T;
  }

  // cfo-approval.model.ts
export type CfoFeedback = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CfoApprovalRequest {
  travelId: string;
  feedback: CfoFeedback;
  remarks: string;
}

// bu-head-approval.model.ts
export type BuheadFeedback = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';

export interface BuheadApprovalRequest {
  travelId: string;
  feedback: BuheadFeedback;
  remarks: string;
}
