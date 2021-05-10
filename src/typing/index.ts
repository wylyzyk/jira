export type Raw = number | string;
export interface Users {
  id: string;
  name: string;
  email: string;
  title: string;
  organization: string;
  token: string;
}

export interface Project {
  // TODO: id 为number
  id: string;
  name: string;
  personId: string;
  pin: boolean;
  organization: string;
  created: number;
}

export interface AuthForm {
  username: string;
  password: string;
}
