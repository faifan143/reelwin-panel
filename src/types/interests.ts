// Interest related types
export interface Interest {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInterestDto {
  name: string;
  description?: string;
}

export interface UpdateInterestDto {
  name?: string;
  description?: string;
}
