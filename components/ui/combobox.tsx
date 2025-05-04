"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type ComboboxItem = {
  value: string;
  label: string;
};

type ComboboxProps = {
  items: ComboboxItem[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  popoverClassName?: string;
  triggerClassName?: string;
  disabled?: boolean;
};

export function Combobox({
  items,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search…",
  emptyText = "No option found.",
  className,
  popoverClassName,
  triggerClassName,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const filteredItems = React.useMemo(() => {
    if (!query) return items;
    const normalized = query.toLowerCase().trim();
    return items.filter((item) => {
      const normalizedLabel = item.label.toLowerCase();
      return normalizedLabel.includes(normalized);
    });
  }, [items, query]);

  const selectedItem = React.useMemo(
    () => items.find((item) => item.value === value),
    [items, value]
  );

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", triggerClassName)}
            disabled={disabled}
            onClick={() => setOpen((o) => !o)}
          >
            {selectedItem ? selectedItem.label : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-[300px] p-0", popoverClassName)} align="start">
          <Command>
            <div className="flex h-9 items-center border-b px-3">
              <input
                className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <CommandList>
              {filteredItems.length === 0 ? (
                <CommandEmpty>{emptyText}</CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredItems.map((item) => (
                    <CommandItem
                      key={item.value}
                      onSelect={() => {
                        onValueChange(item.value);
                        setQuery("");
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
