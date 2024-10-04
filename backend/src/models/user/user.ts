
export class User {
  private id: number;
  private name: string;
  private hashedPassword: string;
  private email: string;
  private tshirt_size: string;
  private pronouns: string | undefined;
  private allergies: string | undefined;
  private accessibilityReqs: string | undefined;

  constructor(
    id: number, name: string, hashedPassword: string, email: string,
    tshirt_size: string, pronouns?: string | undefined, allergies?: string | undefined,
    accessibilityReqs?: string | undefined
  ) {
    this.id = id;
    this.hashedPassword = hashedPassword;
    this.email = email;
    this.tshirt_size = tshirt_size;
    this.pronouns = pronouns;
    this.allergies = allergies;
    this.accessibilityReqs = accessibilityReqs;
  }
}