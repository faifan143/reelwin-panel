// types.ts
export interface Interest {
  id: string;
  name: string;
  targetedGender?: "MALE" | "FEMALE" | null;
  minAge: number;
  maxAge: number;
}
