export interface ApprovalEmailPayload {
    clientKey: string;
    approvalRequestId: string;
    fromEmail: string;
    toEmail: string;
    subject: string;
    body: string;
  }
  