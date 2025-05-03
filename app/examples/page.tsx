"use client";

import { useState } from "react";
import { Combobox, ComboboxItem } from "@/components/ui/combobox";
import { MultiCombobox } from "@/components/ui/multi-combobox";
import { ComboboxDemo, MultiComboboxDemo } from "@/components/ui/combobox-demo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const programmingLanguages: ComboboxItem[] = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
  { value: "kotlin", label: "Kotlin" },
  { value: "csharp", label: "C#" },
  { value: "swift", label: "Swift" },
  { value: "dart", label: "Dart" },
];

export default function ExamplesPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  return (
    <div className="container mx-auto space-y-10 py-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">Combobox Examples</h1>
        <p className="text-muted-foreground">
          Examples of the custom combobox components built with shadcn/ui
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Single Select Combobox</h2>
          <p className="text-muted-foreground">
            A combobox that allows selecting a single item from a list.
          </p>
          <div className="rounded-md border p-6">
            <ComboboxDemo />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium">Multi Select Combobox</h2>
          <p className="text-muted-foreground">
            A combobox that allows selecting multiple items from a list.
          </p>
          <div className="rounded-md border p-6">
            <MultiComboboxDemo />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-medium">Interactive Examples</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Programming Language</CardTitle>
              <CardDescription>Select your favorite programming language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Combobox
                items={programmingLanguages}
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
                placeholder="Select a language..."
                searchPlaceholder="Search languages..."
              />

              {selectedLanguage && (
                <div className="bg-muted rounded-md p-4">
                  <p>
                    You selected:{" "}
                    <span className="font-medium">
                      {programmingLanguages.find((lang) => lang.value === selectedLanguage)?.label}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
              <CardDescription>Select the languages you know (max 3)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MultiCombobox
                items={programmingLanguages}
                values={selectedLanguages}
                onValuesChange={setSelectedLanguages}
                placeholder="Select languages..."
                searchPlaceholder="Search languages..."
                maxValues={3}
              />

              {selectedLanguages.length > 0 && (
                <div className="bg-muted rounded-md p-4">
                  <p>You selected:</p>
                  <ul className="mt-2 list-inside list-disc">
                    {selectedLanguages.map((value) => (
                      <li key={value} className="font-medium">
                        {programmingLanguages.find((lang) => lang.value === value)?.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-medium">Usage</h2>
        <div className="bg-muted/30 rounded-md border p-6">
          <pre className="overflow-x-auto text-sm">
            {`// Single select combobox
const [value, setValue] = useState("")

<Combobox
  items={[
    { value: "item-1", label: "Item 1" },
    { value: "item-2", label: "Item 2" },
  ]}
  value={value}
  onValueChange={setValue}
  placeholder="Select an item..."
/>

// Multi select combobox
const [values, setValues] = useState<string[]>([])

<MultiCombobox
  items={[
    { value: "item-1", label: "Item 1" },
    { value: "item-2", label: "Item 2" },
  ]}
  values={values}
  onValuesChange={setValues}
  placeholder="Select items..."
  maxValues={3}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
