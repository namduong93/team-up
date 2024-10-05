
export interface User {
  id?: number;
  name: string;
  password: string;
  email: string;
  tshirtSize: string;
  pronouns?: string | undefined;
  allergies?: string | undefined;
  accessibilityReqs?: string | undefined;
};