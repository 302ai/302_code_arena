"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
import { Check, ChevronDown, Shuffle } from "lucide-react";
import { useTranslations } from "next-intl";
import { getModelIdByName } from "@/constants/models";

interface ModelSelectProps {
  value: string;
  randomValue: string;
  models: string[];
  className?: string;
  placeholder?: string;
  onChange?: (value: string, actualModel: string) => void;
}

export function ModelSelect({
  value,
  randomValue,
  models,
  placeholder,
  className,
  onChange,
}: ModelSelectProps) {
  const t = useTranslations("modelPk.model_select");

  const [open, setOpen] = useState(false);
  const [internalRandomModel, setInternalRandomModel] = useState<string>("");

  const handleSelect = (newValue: string) => {
    const actualModel = getModelIdByName(newValue);
    if (newValue === "random") {
      setInternalRandomModel(randomValue);
      onChange?.("random", actualModel);
    } else {
      setInternalRandomModel("");
      onChange?.(newValue, actualModel);
    }

    setOpen(false);
  };

  const getDisplayValue = () => {
    if (value === "random") {
      return (
        <span className="flex items-center gap-2">
          <Shuffle className="h-4 w-4 shrink-0" />
          <span>{t("random")}</span>
        </span>
      );
    } else {
      const model = models.find((model) => model === value);
      if (model) {
        return (
          <span className="flex items-center gap-2">
            <span>{model}</span>
          </span>
        );
      }
    }

    return (
      <span className="text-muted-foreground">
        {placeholder ?? t("selectModel")}
      </span>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          role="combobox"
          className={cn(
            "w-full justify-between bg-background px-3 font-normal",
            className
          )}
        >
          {getDisplayValue()}
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[var(--radix-popper-anchor-width)] p-0">
        <Command loop shouldFilter={true} value={value}>
          <CommandInput placeholder={t("searchModels")} />
          <CommandList>
            <CommandEmpty>{t("noResultsFound")}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="random"
                onSelect={() => handleSelect("random")}
                className={cn(
                  "relative flex cursor-pointer items-center gap-2 hover:bg-accent",
                  (value === "random" ||
                    (value === "random" && internalRandomModel)) &&
                    "bg-accent"
                )}
              >
                <Shuffle className="h-4 w-4 shrink-0" />
                <span>{t("random")}</span>
                {value === "random" && (
                  <Check className="absolute right-2 h-4 w-4" />
                )}
              </CommandItem>
            </CommandGroup>
            {models.map((model) => (
              <CommandGroup key={model}>
                <CommandItem
                  value={model}
                  onSelect={() => handleSelect(model)}
                  className={cn(
                    "relative cursor-pointer hover:bg-accent",
                    value === model && "bg-accent"
                  )}
                >
                  <span>{model}</span>
                  {value === model && (
                    <Check className="absolute right-2 h-4 w-4" />
                  )}
                </CommandItem>
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
