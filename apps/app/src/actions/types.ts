export interface ActionResponse<T = any> {
  success: boolean;
  data?: T | null;
  error?: string;
}

export type ActionData<T> =
  | {
      data: T;
      error?: never;
    }
  | {
      error: string;
      data?: never;
    };
