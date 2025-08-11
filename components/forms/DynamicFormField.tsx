// components/forms/DynamicFormField.tsx
import React from 'react';
import { EventQuestion } from '@/lib/types';
import { FieldApi } from '@tanstack/react-form'; // Adjust import based on your form library
import {
  RenderInputField,
  RenderTextArea,
  RenderSelectField,
  RenderDateField,
  RenderTimeField,
  RenderNumberField,
  RenderEmailField,
  RenderCheckboxField,
  RenderRadioField,
  RenderYesNoField,
} from './FormComponents';

interface DynamicFormFieldProps {
  question: EventQuestion;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string;
}

const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  question,
  value,
  onChange,
  onBlur,
  error,
}) => {
  // Create a mock field API object that matches what the form components expect
  const mockField = {
    name: `question-${question.id}`,
    state: {
      value: value || '',
      meta: {
        errors: error ? [error] : [],
        isTouched: true,
        isValidating: false,
      },
    },
    handleChange: onChange,
    handleBlur: onBlur || (() => {}),
  } as any; // Type assertion

  const renderField = () => {
    switch (question.type) {
      case 'ShortText':
        return (
          <RenderInputField
            type="text"
            label={question.label}
            placeholder={question.placeholder}
            field={mockField}
          />
        );

      case 'LongText':
        return (
          <RenderTextArea
            label={question.label}
            placeholder={question.placeholder}
            field={mockField}
          />
        );

      case 'Email':
        return (
          <RenderEmailField
            label={question.label}
            placeholder={question.placeholder}
            field={mockField}
          />
        );

      case 'Number':
        return (
          <RenderNumberField
            label={question.label}
            placeholder={question.placeholder}
            field={mockField}
            min={question.validation?.min as number | undefined}
            max={question.validation?.max as number | undefined}
            step={question.validation?.step as number | undefined}
          />
        );

      case 'Date':
        return (
          <RenderDateField
            label={question.label}
            placeholder={question.placeholder}
            field={mockField}
          />
        );

      case 'Time':
        return (
          <RenderTimeField
            label={question.label}
            placeholder={question.placeholder}
            field={mockField}
          />
        );

      case 'Select':
        if (!question.options) {
          console.warn(`Select question "${question.label}" has no options`);
          return null;
        }
        return (
          <RenderSelectField
            label={question.label}
            placeholder={question.placeholder}
            options={question.options}
            field={mockField}
          />
        );

      case 'Checkbox':
        if (!question.options) {
          console.warn(`Checkbox question "${question.label}" has no options`);
          return null;
        }
        return (
          <RenderCheckboxField
            label={question.label}
            options={question.options}
            field={mockField}
          />
        );

      case 'Radio':
        if (!question.options) {
          console.warn(`Radio question "${question.label}" has no options`);
          return null;
        }
        return (
          <RenderRadioField
            label={question.label}
            options={question.options}
            field={mockField}
          />
        );

      case 'YesNo':
        return (
          <RenderYesNoField
            label={question.label}
            field={mockField}
          />
        );

      default:
        console.warn(`Unsupported question type: ${question.type}`);
        return (
          <RenderInputField
            type="text"
            label={question.label}
            placeholder={question.placeholder}
            field={mockField}
          />
        );
    }
  };

  return <div className="space-y-2">{renderField()}</div>;
};

export default DynamicFormField;