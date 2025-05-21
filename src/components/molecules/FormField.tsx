import React from 'react';
import Input, { InputProps } from '../atoms/Input';
import Label from '../atoms/Label';

export interface FormFieldProps extends Omit<InputProps, 'id'> {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  required = false,
  helperText,
  ...inputProps
}) => {
  return (
    <div className="mb-4">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      
      <Input 
        id={id} 
        error={error} 
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...inputProps} 
      />
      
      {helperText && !error && (
        <p id={`${id}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormField;