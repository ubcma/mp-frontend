// components/forms/FormComponents.tsx (Extended version)
import { AnyFieldApi } from '@tanstack/react-form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Button } from '../ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import { DateTimePicker } from '../DateTimePicker';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useIsMobile } from '@/hooks/use-mobile';

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <div>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className="text-ma-red text-xs">
          {field.state.meta.errors.join(', ')}
        </p>
      ) : null}
      {field.state.meta.isValidating ? (
        <p className="text-neutral-500 text-xs">Validating...</p>
      ) : null}
    </div>
  );
}

export function RenderInputField({
  type,
  placeholder,
  label,
  field,
  onChange,
  labelClassName,
}: {
  type?: string;
  placeholder?: string;
  label: string;
  field: AnyFieldApi;
  onChange?: (value: string) => void;
  labelClassName?: string;
}) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col gap-2 w-full text-left">
      <Label htmlFor={field.name} className={labelClassName}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) =>
          onChange
            ? onChange(e.target.value)
            : field.handleChange(e.target.value)
        }
        type={type}
        placeholder={placeholder ?? label}
        className={`bg-white ${isMobile ? 'h-9 text-sm' : 'h-10'}`}
      />
      <FieldInfo field={field} />
    </div>
  );
}

export function RenderTextArea({
  placeholder,
  label,
  field,
}: {
  placeholder?: string;
  label: string;
  field: AnyFieldApi;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder ?? label}
      />
      <FieldInfo field={field} />
    </div>
  );
}

export function RenderSelectField({
  options,
  placeholder,
  label,
  field,
  disabled,
  labelClassName,
}: {
  options: string[];
  placeholder?: string;
  label: string;
  field: AnyFieldApi;
  disabled?: boolean;
  labelClassName?: string;
}) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor={field.name} className={labelClassName}>{label}</Label>
      <Select
        value={field.state.value ?? ''}
        onValueChange={(value) => field.handleChange(value)}
        disabled={disabled}
      >
        <SelectTrigger className='w-full bg-white'>
          <SelectValue
            placeholder={placeholder || 'Select'}
            defaultValue={field.state.value}
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldInfo field={field} />
    </div>
  );
}

export function RenderComboBoxField({
  options,
  placeholder,
  label,
  field,
  disabled,
  labelClassName,
}: {
  options: string[];
  placeholder?: string;
  label: string;
  field: AnyFieldApi;
  disabled?: boolean;
  labelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(field.state.value || '');
  const [inputValue, setInputValue] = useState('');
  const isMobile = useIsMobile();

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  const hasMatchingOptions = filteredOptions.length > 0;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor={field.name} className={labelClassName}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'justify-between font-normal w-full',
              value ? '' : 'text-neutral-400',
              isMobile ? 'h-9 text-sm' : 'h-10'
            )}
          >
            <span className="truncate overflow-hidden whitespace-nowrap max-w-[6rem] lg:max-w-[8rem]">
              {value || placeholder || 'Select'}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder="Search..."
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => {
                if (inputValue.trim()) {
                  field.handleChange(inputValue.trim());
                  setValue(inputValue.trim());
                }
                setOpen(false);
              }}
            />
            <CommandList>
              <CommandEmpty> No options found </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={(currentValue) => {
                      field.handleChange(currentValue);
                      setValue(currentValue);
                      setInputValue('');
                      setOpen(false);
                    }}
                  >
                    {option}
                  </CommandItem>
                ))}
                {inputValue && !hasMatchingOptions && (
                  <CommandItem
                    key="create-new"
                    value={inputValue}
                    onSelect={() => {
                      field.handleChange(inputValue);
                      setValue(inputValue);
                      setInputValue('');
                      setOpen(false);
                    }}
                  >
                    {`Choose "${inputValue}"`}
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FieldInfo field={field} />
    </div>
  );
}

export function RenderDateTimeField({
  label,
  field,
}: {
  label: string;
  field: AnyFieldApi;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <DateTimePicker
        value={field.state.value ? new Date(field.state.value) : null}
        onChange={(date) => field.handleChange(date)}
        onBlur={field.handleBlur}
      />
      <FieldInfo field={field} />
    </div>
  );
}

// NEW COMPONENTS FOR EVENT REGISTRATION FORMS

export function RenderDateField({
  label,
  field,
  placeholder,
}: {
  label: string;
  field: AnyFieldApi;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        type="date"
        value={field.state.value || ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
      />
      <FieldInfo field={field} />
    </div>
  );
}

export function RenderTimeField({
  label,
  field,
  placeholder,
}: {
  label: string;
  field: AnyFieldApi;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        type="time"
        value={field.state.value || ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
      />
      <FieldInfo field={field} />
    </div>
  );
}

export function RenderNumberField({
  label,
  field,
  placeholder,
  min,
  max,
  step,
}: {
  label: string;
  field: AnyFieldApi;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string for clearing the field
    if (value === '') {
      field.handleChange('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      field.handleChange(numValue);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        type="number"
        value={field.state.value === 0 ? '0' : field.state.value || ''}
        onBlur={field.handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
      />
      <FieldInfo field={field} />
    </div>
  );
}

export function RenderEmailField({
  label,
  field,
  placeholder,
}: {
  label: string;
  field: AnyFieldApi;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        type="email"
        value={field.state.value || ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder || 'Enter your email'}
      />
      <FieldInfo field={field} />
    </div>
  );
}

export function RenderCheckboxField({
  label,
  field,
  options,
}: {
  label?: string;
  field: AnyFieldApi;
  options: string[];
}) {
  const currentValues = Array.isArray(field.state.value) ? field.state.value : [];

  const handleCheckboxChange = (option: string, checked: boolean) => {
    let newValues;
    if (checked) {
      newValues = [...currentValues, option];
    } else {
      newValues = currentValues.filter((value: string) => value !== option);
    }
    field.handleChange(newValues);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`${field.name}-${index}`}
              checked={currentValues.includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(option, !!checked)}
            />
            <Label 
              htmlFor={`${field.name}-${index}`}
              className="text-sm font-normal cursor-pointer"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
      <FieldInfo field={field} />
    </div>
  );
}

export function RenderRadioField({
  label,
  field,
  options,
}: {
  label: string;
  field: AnyFieldApi;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <RadioGroup
        value={field.state.value || ''}
        onValueChange={field.handleChange}
      >
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option} 
              id={`${field.name}-${index}`}
            />
            <Label 
              htmlFor={`${field.name}-${index}`}
              className="text-sm font-normal cursor-pointer"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <FieldInfo field={field} />
    </div>
  );
}

export function RenderYesNoField({
  label,
  field,
}: {
  label: string;
  field: AnyFieldApi;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <RadioGroup
        value={field.state.value || ''}
        onValueChange={field.handleChange}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id={`${field.name}-yes`} />
          <Label 
            htmlFor={`${field.name}-yes`}
            className="text-sm font-normal cursor-pointer"
          >
            Yes
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id={`${field.name}-no`} />
          <Label 
            htmlFor={`${field.name}-no`}
            className="text-sm font-normal cursor-pointer"
          >
            No
          </Label>
        </div>
      </RadioGroup>
      <FieldInfo field={field} />
    </div>
  );
}