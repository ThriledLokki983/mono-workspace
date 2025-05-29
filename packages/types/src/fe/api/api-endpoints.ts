export interface ApiEndpointInterface {
  endpoint: string;
  method: string;
  cache?: boolean;
  json?: boolean;
  throwError?: boolean;
  formData?: boolean;
  multipart?: boolean;
  cacheControl?: string;
}
