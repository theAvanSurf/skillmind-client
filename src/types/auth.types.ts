enum AccountTypes{
  Free = 0,
  Premium = 1
}

enum Roles {
  Professor = 0,
  Admin = 1,
  Student = 2
}

export interface User {
  name: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  birthDate: Date;
  phoneNumber: string;
  country: string;
  accountTypes: AccountTypes;
  role: Roles;
}

export interface RegistrationDraft {
  // Step 1 — personal info
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  country: string;
  // Step 2 — account info
  email: string;
  password: string;
  userName: string;
  // Step 3 — plan
  plan: "free" | "premium" | null;
}

export interface SignUpData  {

}