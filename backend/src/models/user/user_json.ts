
export interface UserJSON {
  id: number;
  name: string;
  hashedPassword: string;
  email: string;
  tshirt_size: string;
  pronouns?: string | undefined;
  allergies?: string | undefined;
  accessibilityReqs?: string | undefined;
};