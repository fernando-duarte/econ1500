"use client"

import * as React from "react"
import { Combobox } from "./combobox"
import { MultiCombobox } from "./multi-combobox"

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