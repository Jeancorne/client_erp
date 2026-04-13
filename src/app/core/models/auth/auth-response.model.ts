import { AuthData } from './auth-data.model';

export interface AuthResponse {
  succeeded: boolean;
  message: string | null;
  errors: string[] | null;
  data: AuthData;
}
