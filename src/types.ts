// types.ts
export interface VersionUpdateForm {
  version: string;
  isRequired: boolean;
}

export interface CommonProps {
  token: string;
  setError: (error: string | null) => void;
}
