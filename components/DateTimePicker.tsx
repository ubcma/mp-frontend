// components/DateTimePicker.tsx
import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  onBlur?: () => void;
}

export const DateTimePicker = React.forwardRef<HTMLButtonElement, DateTimePickerProps>(
  ({ value, onChange, onBlur }, ref) => {
    const [date, setDate] = React.useState<Date | null>(value ?? null);
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
      setDate(value ?? null);
    }, [value]);

    const handleDateSelect = (selectedDate: Date | undefined) => {
      if (selectedDate) {
        const updated = new Date(selectedDate);
        updated.setHours(date?.getHours() || 0);
        updated.setMinutes(date?.getMinutes() || 0);
        onChange(updated);
      }
    };

    const handleTimeChange = (type: "hour" | "minute" | "ampm", val: string) => {
      if (date) {
        const newDate = new Date(date);
        if (type === "hour") {
          const hour = parseInt(val);
          const isPM = newDate.getHours() >= 12;
          newDate.setHours(hour % 12 + (isPM ? 12 : 0));
        } else if (type === "minute") {
          newDate.setMinutes(parseInt(val));
        } else if (type === "ampm") {
          const currentHours = newDate.getHours();
          if (val === "AM" && currentHours >= 12) {
            newDate.setHours(currentHours - 12);
          } else if (val === "PM" && currentHours < 12) {
            newDate.setHours(currentHours + 12);
          }
        }
        setDate(newDate);
        onChange(newDate);
      }
    };

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            onBlur={onBlur}
            className={cn(
                "w-full justify-start text-left font-normal overflow-hidden text-ellipsis whitespace-nowrap",
                !date && "text-muted-foreground"
              )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "MM/dd/yyyy hh:mm aa") : <span>Select date and time</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <div className="flex flex-row">
            <Calendar
            className="w-full flex-col"
              mode="single"
              selected={date ?? undefined}
              onSelect={handleDateSelect}
            />
            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {hours.map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={date && date.getHours() % 12 === hour % 12 ? "default" : "ghost"}
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("hour", hour.toString())}
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>

              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={date?.getMinutes() === minute ? "default" : "ghost"}
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("minute", minute.toString())}
                    >
                      {minute}
                    </Button>
                  ))}
                </div>
              </ScrollArea>

              <ScrollArea>
                <div className="flex sm:flex-col p-2">
                  {["AM", "PM"].map((ampm) => (
                    <Button
                      key={ampm}
                      size="icon"
                      variant={
                        date && ((ampm === "AM" && date.getHours() < 12) || (ampm === "PM" && date.getHours() >= 12))
                          ? "default"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("ampm", ampm)}
                    >
                      {ampm}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

DateTimePicker.displayName = "DateTimePicker";
