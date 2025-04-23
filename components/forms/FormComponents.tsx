import { AnyFieldApi } from '@tanstack/react-form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

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
}: {
  type?: string;
  placeholder?: string;
  label: string;
  field: AnyFieldApi;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        type={type}
        placeholder={placeholder}
      />
      <FieldInfo field={field} />
    </div>
  );
}
