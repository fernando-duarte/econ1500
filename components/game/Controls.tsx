"use client";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Slider } from "@/components/ui/slider";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { growthModel } from "@/lib/constants";
import type { Controls } from "@/lib/game/types";
import { useEffect, useRef } from "react";

const schema = z.object({
  savingRate: z.number().min(0.0001).max(0.9999),
  exchangePolicy: z.enum(
    growthModel.EXCHANGE_OPTIONS.map((o) => o.value.toFixed(1)) as [string, ...string[]]
  ),
});

type FormValues = z.infer<typeof schema>;

export function Controls({
  onSubmit,
  onChange,
}: {
  onSubmit: (c: Controls) => void;
  onChange?: (c: Controls) => void;
}) {
  const { control, handleSubmit, watch, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { savingRate: 0.1, exchangePolicy: "1.0" },
  });
  const live = watch();

  // Use refs to keep track of previous values to avoid unnecessary updates
  const prevValuesRef = useRef({
    savingRate: 0.1,
    exchangePolicy: "1.0",
  });

  // Call onChange only when values actually change
  useEffect(() => {
    const currentSavingRate = live.savingRate;
    const currentExchangePolicy = live.exchangePolicy;

    if (
      onChange &&
      (prevValuesRef.current.savingRate !== currentSavingRate ||
        prevValuesRef.current.exchangePolicy !== currentExchangePolicy)
    ) {
      // Update the previous values ref
      prevValuesRef.current = {
        savingRate: currentSavingRate,
        exchangePolicy: currentExchangePolicy,
      };

      // Call onChange with the new values
      onChange({
        savingRate: currentSavingRate,
        exchangePolicy: parseFloat(currentExchangePolicy) as 0.8 | 1.0 | 1.2,
      });
    }
  }, [live, onChange]);

  // Helper function to get the label for the current exchange policy
  // const getCurrentExchangePolicyLabel = () => {
  //   const option = growthModel.EXCHANGE_OPTIONS.find(
  //     (o) => o.value.toFixed(1) === live.exchangePolicy
  //   );
  //   return option ? option.label : "Market (×1.0)";
  // };

  return (
    <form
      onSubmit={handleSubmit((v) =>
        onSubmit({
          savingRate: v.savingRate,
          exchangePolicy: parseFloat(v.exchangePolicy) as 0.8 | 1.0 | 1.2,
        })
      )}
      className="space-y-6 rounded border p-4"
    >
      <div className="mb-4">
        <label className="mb-2 block text-lg">Saving Rate: {live.savingRate.toFixed(2)}</label>
        <Controller
          name="savingRate"
          control={control}
          render={({ field }) => (
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[field.value]}
              onValueChange={([v]) => field.onChange(v)}
            />
          )}
        />
      </div>

      {/* Separator added here */}
      <hr className="my-4" />

      <div className="mb-6">
        <label className="mb-2 block text-lg">Exchange Rate:</label>
        <Controller
          name="exchangePolicy"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex space-x-6"
            >
              {growthModel.EXCHANGE_OPTIONS.map((o) => (
                <RadioGroup.Item key={o.value} value={o.value.toFixed(1)} className="text-xl">
                  {o.label.split(" (")[0]}
                </RadioGroup.Item>
              ))}
            </RadioGroup>
          )}
        />
      </div>

      {/* Separator added here */}
      <hr className="my-4" />

      <div className="flex justify-center">
        <Button type="submit" disabled={!formState.isValid} className="text-lg">
          Submit
        </Button>
      </div>
    </form>
  );
}
