export interface ActionResponse<T = any> {
  success: boolean;
  data?: T | null;
  error?: string;
}
