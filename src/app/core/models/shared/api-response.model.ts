export interface ApiResponse<T> {
  succeeded: boolean;
  message: string | null;
  errors: string[] | null;
  data: T;
  traceId?: string;
}
