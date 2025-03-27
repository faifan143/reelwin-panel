// Types
interface ContentFormData {
  title: string;
  description: string;
  ownerName: string;
  ownerNumber: string;
  intervalHours: number;
  endValidationDate: string;
  interestIds: string[];
  type: "REEL";
  mediaUrls: string[];
}

interface Interest {
  id: string;
  name: string;
}

interface FormSectionProps {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  children: React.ReactNode;
}

interface MediaPreviewProps {
  files: File[];
  removeFile: (index: number) => void;
  isVideo?: boolean;
}

interface StatusMessageProps {
  type: 'success' | 'error' | 'loading';
  title: string;
  message: string;
  error?: any;
}

interface MediaUploaderProps {
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
