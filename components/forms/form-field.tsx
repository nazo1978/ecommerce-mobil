'use client';

import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, description, required, className, id, ...props }, ref) => {
    const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={fieldId} className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        <Input
          id={fieldId}
          ref={ref}
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        />
        
        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
