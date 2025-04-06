export type ContentOwnerType  = "INDIVIDUAL"| "STORE"

// Types
export interface ContentFormData {
  title: string;
  description: string;
  ownerType: ContentOwnerType;
  ownerName?: string;
  ownerNumber?: string;
  storeId?: string;
  type: "REEL";
  intervalHours: number;
  endValidationDate: string;
  interestIds?: string[];
  mediaUrls?: string[];
}

export interface Interest {
  id: string;
  name: string;
}

export interface FormSectionProps {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  children: React.ReactNode;
}

export interface MediaPreviewProps {
  files: File[];
  removeFile: (index: number) => void;
  isVideo?: boolean;
}

export interface StatusMessageProps {
  type: "success" | "error" | "loading";
  title: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
}

export interface MediaUploaderProps {
  label: string;
  icon: React.ReactNode;
  fileType: string;
  accept: string;
  colorScheme: {
    gradient: string;
    border: string;
    bg: string;
    hover: string;
    text: string;
  };
  files: File[];
  onFilesChange: (files: File[]) => void;
}
