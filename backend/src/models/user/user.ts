
export class User {
  private id: number;
  private name: string;
  private password: string;
  private email: string;
  private tshirt_size: string;
  private pronouns: string | undefined;
  private allergies: string | undefined;
  private accessibilityReqs: string | undefined;

  constructor(
    id: number, name: string, password: string, email: string,
    tshirt_size: string, pronouns?: string | undefined, allergies?: string | undefined,
    accessibilityReqs?: string | undefined
  ) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.email = email;
    this.tshirt_size = tshirt_size;
    this.pronouns = pronouns;
    this.allergies = allergies;
    this.accessibilityReqs = accessibilityReqs;
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getpassword(): string {
    return this.password;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getTshirtSize(): string {
    return this.tshirt_size;
  }

  getPronouns(): string | undefined {
    return this.pronouns;
  }

  getAllergies(): string | undefined {
    return this.allergies;
  }

  getAccessibilityReqs(): string | undefined {
    return this.accessibilityReqs;
  }
}