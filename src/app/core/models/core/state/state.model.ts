import { City } from '../city/city.model';

export interface State {
  id: string;
  coreCountryId: string;
  name: string;
  code: string;
  cities?: City[];
  createdAt?: string;
}
