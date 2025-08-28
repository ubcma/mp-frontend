'use client';

import { useState } from 'react';

type TermsCheckboxProps = {
  onChange: (checked: boolean) => void;
};

export default function TermsCheckbox({ onChange }: TermsCheckboxProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setChecked(value);
    onChange(value);
  };

  return (
    <div className="flex items-start space-x-2 mt-6">
      <input
        id="terms"
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="mt-1 h-4 w-4 border-gray-300 rounded text-red-600 focus:ring-red-500"
      />
      <label htmlFor="terms" className="text-sm text-gray-600 leading-5">
        I agree to the{' '}
        <a
          href="/terms-of-service"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-red-600 hover:text-red-800"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-red-600 hover:text-red-800"
        >
          Privacy Policy
        </a>
        .
      </label>
    </div>
  );
}
