"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export type ComboboxItem = {
    value: string
    label: string
}

type ComboboxProps = {
    items: ComboboxItem[]
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    className?: string
    popoverClassName?: string
    triggerClassName?: string
    disabled?: boolean
}

export function Combobox({
    items,
    value,
    onValueChange,
    placeholder = "Select an option...",
    searchPlaceholder = "Search...",
    emptyText = "No option found.",
    className,
    popoverClassName,
    triggerClassName,
    disabled = false,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false)

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
                    >
                        {value
                            ? items.find((item) => item.value === value)?.label
                            : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={cn("p-0", popoverClassName)}>
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList>
                            <CommandEmpty>{emptyText}</CommandEmpty>
                            <CommandGroup>
                                {items.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.value}
                                        onSelect={(currentValue) => {
                                            onValueChange(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
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
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

type MultiComboboxProps = {
    items: ComboboxItem[]
    values: string[]
    onValuesChange: (values: string[]) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    className?: string
    popoverClassName?: string
    triggerClassName?: string
    disabled?: boolean
    maxValues?: number
}

export function MultiCombobox({
    items,
    values,
    onValuesChange,
    placeholder = "Select options...",
    searchPlaceholder = "Search...",
    emptyText = "No option found.",
    className,
    popoverClassName,
    triggerClassName,
    disabled = false,
    maxValues,
}: MultiComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")

    const selectedLabels = React.useMemo(() => {
        return values
            .map((value) => items.find((item) => item.value === value)?.label)
            .filter(Boolean) as string[]
    }, [values, items])

    const handleSelect = React.useCallback(
        (currentValue: string) => {
            if (values.includes(currentValue)) {
                onValuesChange(values.filter((v) => v !== currentValue))
            } else {
                if (maxValues !== undefined && values.length >= maxValues) {
                    return
                }
                onValuesChange([...values, currentValue])
            }
        },
        [values, onValuesChange, maxValues]
    )

    const handleRemoveValue = (value: string) => {
        onValuesChange(values.filter((v) => v !== value))
    }

    const filteredItems = React.useMemo(() => {
        if (!inputValue) return items

        return items.filter((item) =>
            item.label.toLowerCase().includes(inputValue.toLowerCase())
        )
    }, [items, inputValue])

    return (
        <div className={className}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between min-h-9",
                            values.length > 0 ? "h-auto" : "",
                            triggerClassName
                        )}
                        disabled={disabled}
                        onClick={() => setOpen(true)}
                    >
                        <div className="flex flex-wrap gap-1 mr-2">
                            {selectedLabels.length > 0 ? (
                                selectedLabels.map((label, i) => (
                                    <div
                                        key={i}
                                        className="bg-muted flex items-center gap-1 rounded-sm px-1 py-0.5 text-xs"
                                    >
                                        <span>{label}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                const valueToRemove = values[i]
                                                if (valueToRemove) {
                                                    handleRemoveValue(valueToRemove)
                                                }
                                            }}
                                            className="text-muted-foreground hover:text-foreground rounded-sm"
                                        >
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remove {label}</span>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <span className="text-muted-foreground">{placeholder}</span>
                            )}
                        </div>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={cn("p-0", popoverClassName)}>
                    <Command>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            value={inputValue}
                            onValueChange={setInputValue}
                        />
                        <CommandList>
                            <CommandEmpty>{emptyText}</CommandEmpty>
                            <CommandGroup>
                                {filteredItems.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.value}
                                        onSelect={handleSelect}
                                    >
                                        <div className="flex items-center">
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    values.includes(item.value) ? "opacity-100" : "opacity-0"
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
    )
}

// Example usage
export function ComboboxDemo() {
    const [value, setValue] = React.useState("")

    const frameworks = [
        { value: "next.js", label: "Next.js" },
        { value: "sveltekit", label: "SvelteKit" },
        { value: "nuxt.js", label: "Nuxt.js" },
        { value: "remix", label: "Remix" },
        { value: "astro", label: "Astro" },
    ]

    return (
        <Combobox
            items={frameworks}
            value={value}
            onValueChange={setValue}
            placeholder="Select framework..."
            searchPlaceholder="Search framework..."
            emptyText="No framework found."
            className="w-[200px]"
        />
    )
}

export function MultiComboboxDemo() {
    const [values, setValues] = React.useState<string[]>([])

    const frameworks = [
        { value: "next.js", label: "Next.js" },
        { value: "sveltekit", label: "SvelteKit" },
        { value: "nuxt.js", label: "Nuxt.js" },
        { value: "remix", label: "Remix" },
        { value: "astro", label: "Astro" },
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" },
        { value: "angular", label: "Angular" },
    ]

    return (
        <MultiCombobox
            items={frameworks}
            values={values}
            onValuesChange={setValues}
            placeholder="Select frameworks..."
            searchPlaceholder="Search frameworks..."
            emptyText="No framework found."
            className="w-[300px]"
            maxValues={5}
        />
    )
} 