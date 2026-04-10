export interface LoginRequest {
  username: string;
  password: string;
}

export interface MenuItem {
  id: string;
  name: string;
  icon?: string | null;
  sequence: number;
  routePath?: string;
  actions?: string[];
  items?: MenuItem[]; // Soporte para submenús recursivos
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  companyId: string;
  isMainAdmin: boolean;
}

export interface AuthData {
  token: string;
  user: UserInfo;
  menus: MenuItem[];
}

export interface AuthResponse {
  succeeded: boolean;
  message: string | null;
  errors: string[] | null;
  data: AuthData;
}
