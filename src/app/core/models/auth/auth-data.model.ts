import { UserInfo } from './user-info.model';
import { MenuItem } from './menu-item.model';

export interface AuthData {
  token: string;
  user: UserInfo;
  menus: MenuItem[];
}
