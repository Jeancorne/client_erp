export interface Country {
  id: string;
  name: string;
  isoCode2: string;
  phonePrefix: string;
  createdAt?: string;
}

export interface State {
  id: string;
  coreCountryId: string;
  name: string;
  code: string;
  createdAt?: string;
}

export interface City {
  id: string;
  coreStateId: string;
  name: string;
  daneCode: string;
  createdAt?: string;
}
