import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { GripVertical, Trash2 } from 'lucide-react';
import { QUESTION_TYPES, QuestionInput } from '@/lib/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export function DraggableCard({
  question,
  index,
  onChange,
  onDelete,
}: {
  question: QuestionInput;
  index: number;
  onChange: (
    index: number,
    field: keyof QuestionInput,
    value: string | string[] | number | boolean
  ) => void;
  onDelete: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 0,
  };

  const NEEDS_OPTIONS = ['Select', 'Radio', 'Checkbox'].includes(question.type);
  const NEEDS_PLACEHOLDER = [
    'ShortText',
    'LongText',
    'Email',
    'Date',
    'Time',
    'Select',
    'YesNo',
  ].includes(question.type);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn('p-6', isDragging && 'shadow-lg')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div {...listeners} {...attributes} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-md font-medium">
            {question.label || `Question ${index + 1}`}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <Select
            value={question.type}
            onValueChange={(value) => onChange(index, 'type', value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 cursor-pointer">
            <Switch
              id={`required-switch-${index}`}
              onCheckedChange={(checked) =>
                onChange(index, 'isRequired', checked)
              }
              className="data-[state=checked]:bg-emerald-400"
            />
            <Label htmlFor={`required-switch-${index}`}>Required?</Label>
          </div>

          {/* DELETE BUTTON */}
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="bg-rose-100 text-ma-red rounded-full hover:bg-rose-200 hover:text-rose-700"
            onClick={() => onDelete(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          placeholder="Question Label"
          value={question.label}
          onChange={(e) => onChange(index, 'label', e.target.value)}
        />
        
        {NEEDS_PLACEHOLDER && (
          <Input
            placeholder="Placeholder Text"
            value={question.placeholder}
            onChange={(e) => onChange(index, 'placeholder', e.target.value)}
          />
        )}

        {NEEDS_OPTIONS && (
          <div className="space-y-2">
            <Label className="block text-sm font-medium">Field Options</Label>
            <Input
              type="text"
              placeholder="Type an option and press Enter"
              className="border rounded px-3 py-2 w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value && !question.options?.includes(value)) {
                    const updatedOptions = [...(question.options || []), value];
                    onChange(index, 'options', updatedOptions);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />

            <div className="flex flex-wrap gap-2 mt-2">
              {question.options?.map((option, optIndex) => (
                <div
                  key={optIndex}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm"
                >
                  {option}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedOptions = (question.options || []).filter(
                        (_, i) => i !== optIndex
                      );
                      onChange(index, 'options', updatedOptions);
                    }}
                    className="text-red-500 ml-1"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
