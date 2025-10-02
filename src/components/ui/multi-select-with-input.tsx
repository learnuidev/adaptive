import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectWithInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  options?: string[];
  placeholder?: string;
  isLoading?: boolean;
}

export function MultiSelectWithInput({
  values,
  onChange,
  options = [],
  placeholder = "Select values...",
  isLoading = false,
}: MultiSelectWithInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addValue = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue && !values.includes(trimmedValue)) {
      onChange([...values, trimmedValue]);
    }
    setInputValue("");
  };

  const removeValue = (valueToRemove: string) => {
    onChange(values.filter((v) => v !== valueToRemove));
  };

  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      removeValue(value);
    } else {
      addValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      addValue(inputValue);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 py-2"
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {values.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              values.map((value) => (
                <Badge
                  key={value}
                  variant="secondary"
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeValue(value);
                  }}
                >
                  {value}
                  <X className="ml-1 h-3 w-3 cursor-pointer" />
                </Badge>
              ))
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-popover z-50" align="start">
        <Command>
          <CommandInput
            ref={inputRef}
            placeholder="Search or type to add..."
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            {isLoading && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            )}
            {!isLoading && options.length === 0 && inputValue && (
              <CommandEmpty>
                Press Enter to add "{inputValue}"
              </CommandEmpty>
            )}
            {!isLoading && options.length === 0 && !inputValue && (
              <CommandEmpty>Type to add custom values</CommandEmpty>
            )}
            {!isLoading && options.length > 0 && (
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => toggleValue(option)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        values.includes(option)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {values.includes(option) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
