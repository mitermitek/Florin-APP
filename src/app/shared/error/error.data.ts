export interface ErrorResponse<T extends string> {
  type: T;
  message: string;
}
