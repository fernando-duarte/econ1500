"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { ComboboxItem } from "./combobox";

export type MultiComboboxProps = {
  items: ComboboxItem[];
  values: string[];
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  popoverClassName?: string;
  triggerClassName?: string;
  disabled?: boolean;
  maxValues?: number;
};

export function MultiCombobox({
  items,
  values: _values,
  onValuesChange: _onValuesChange,
  placeholder = "Select options…",
  searchPlaceholder = "Search…",
  emptyText = "No option found.",
  className,
  popoverClassName,
  triggerClassName,
  disabled = false,
  maxValues,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = React.useCallback(
    (current: string) => {
      if (_values.includes(current)) {
        _onValuesChange(_values.filter((v) => v !== current));
      } else {
        if (maxValues !== undefined && _values.length >= maxValues) return;
        _onValuesChange([..._values, current]);
      }
    },
    [_values, _onValuesChange, maxValues]
  );

  const handleRemove = (val: string) => {
    _onValuesChange(_values.filter((v) => v !== val));
  };

  const filteredItemsMulti = React.useMemo(() => {
    if (!inputValue) return items;
    const normalized = inputValue.toLowerCase().trim();
    return items.filter((item) => item.label.toLowerCase().includes(normalized));
  }, [items, inputValue]);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "min-h-9 w-full justify-between",
              _values.length > 0 ? "h-auto" : "",
              triggerClassName
            )}
            disabled={disabled}
            onClick={() => setOpen(true)}
          >
            <div className="mr-2 flex flex-wrap gap-1">
              {_values.map((v, i) => {
                const label = items.find((item) => item.value === v)?.label;
                return (
                  <div
                    key={i}
                    className="bg-muted flex items-center gap-1 rounded-sm px-1 py-0.5 text-xs"
                  >
                    <span>{label}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(v);
                      }}
                      className="text-muted-foreground hover:text-foreground rounded-sm"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {label}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {_values.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-[300px] p-0", popoverClassName)}>
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {filteredItemsMulti.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleSelect(item.value)}
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          _values.includes(item.value) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.label}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
