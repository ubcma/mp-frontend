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
}: {
  type?: string;
  placeholder?: string;
  label: string;
  field: AnyFieldApi;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{label}</Label>
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
}: {
  options: string[];
  placeholder?: string;
  label: string;
  field: AnyFieldApi;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor={field.name}>{label}</Label>
      <Select
        value={field.state.value ?? ''}
        onValueChange={(value) => field.handleChange(value)}
        disabled={disabled}
      >
        <SelectTrigger className='w-full'>
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
}: {
  options: string[];
  placeholder?: string;
  label: string;
  field: AnyFieldApi;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(field.state.value || '');
  const [inputValue, setInputValue] = useState('');

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  const hasMatchingOptions = filteredOptions.length > 0;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor={field.name}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'justify-between font-normal w-full',
              value ? '' : 'text-neutral-400'
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
