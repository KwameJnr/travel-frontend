export interface ApiResponse<T> {
    statusCode: number;
    statusMessage: string;
    serverTimestamp: string;
    data: T;
  }
  