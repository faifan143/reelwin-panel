// ErrorDisplay.tsx
import React from "react";
import { Alert } from "antd";

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Alert
      message="خطأ"
      description={error}
      type="error"
      showIcon
      className="mb-4 sm:mb-6"
    />
  );
};

export default ErrorDisplay;
