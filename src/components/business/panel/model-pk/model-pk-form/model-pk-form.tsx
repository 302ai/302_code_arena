"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GLOBAL } from "@/constants/values";
import { languageAtom } from "@/stores/slices/language_store";
import { pkFormAtom, SupportedGenType } from "@/stores/slices/form_store";
import { useAtom, useAtomValue } from "jotai";
import { useTranslations } from "next-intl";
import { useGetModels } from "@/hooks/get-models/use-get-models";
import { ModelSelect } from "./model-select";
import { useGenCode } from "@/hooks/gen-code/use-gen-code";
import { LoaderRenderer } from "@/components/common/loader-renderer";
import { Loader2 } from "lucide-react";
import { TbSwords } from "react-icons/tb";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getModelNameList } from "@/constants/models";
import { useIsMobile } from "@/hooks/global/use-mobile";
import { cn } from "@/lib/utils";
export function ModelPkForm() {
  const t = useTranslations("modelPk.pk_form");

  const isMobile = useIsMobile();

  const {
    randomModelLeft,
    randomModelRight,

    updateRandomModels,
  } = useGetModels();

  const {
    leftDisplay,
    rightDisplay,
    isGenerating,

    handleModelChange,
    handleGenerate,
  } = useGenCode({
    randomModelLeft,
    randomModelRight,
    updateRandomModels,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);

  const locale = useAtomValue(languageAtom);
  const [pkForm, setPkForm] = useAtom(pkFormAtom);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-y-8",
        isMobile && "gap-y-4"
      )}
    >
      <div className="flex w-[70%] min-w-[350px] flex-row items-center justify-center gap-x-2">
        <Select
          value={pkForm.type}
          onValueChange={(value) => {
            if (value)
              setPkForm((prev) => ({
                ...prev,
                type: value as SupportedGenType,
              }));
          }}
        >
          <SelectTrigger className="h-10 w-[15%] min-w-[100px]">
            <SelectValue placeholder={GLOBAL.GEN_TYPE.DEFAULT.name} />
          </SelectTrigger>
          <SelectContent>
            {GLOBAL.GEN_TYPE.SUPPORTED.map(({ value, name }) => (
              <SelectItem key={value} value={value}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          className="h-10"
          id="model-prompt"
          value={pkForm.prompt}
          onChange={(e) =>
            setPkForm((prev) => ({ ...prev, prompt: e.target.value }))
          }
          placeholder={t("input_placeholder")}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {GLOBAL.QUICK_START.SUPPORTED.filter(
          (item) => item.type === pkForm.type
        ).map((item) => (
          <Button
            key={item.text}
            variant="secondary"
            size={isMobile ? "sm" : "default"}
            onClick={() =>
              setPkForm((prev) => ({
                ...prev,
                prompt: item.prompt[locale as keyof typeof item.prompt],
                type: item.type as SupportedGenType,
              }))
            }
            className="text-sm text-muted-foreground"
          >
            <span className="max-w-[350px] truncate">
              {t(`quick_start.${item.text}`)}
            </span>
          </Button>
        ))}
      </div>

      <Button
        ref={buttonRef}
        variant="default"
        size="lg"
        onClick={handleGenerate}
        disabled={!pkForm.prompt || pkForm.prompt.trim() === "" || isGenerating}
      >
        <LoaderRenderer
          status={isGenerating ? "generating" : "idle"}
          statuses={{
            generating: {
              icon: <Loader2 className="h-4 w-4 animate-spin" />,
              text: t("generating"),
            },
            idle: {
              icon: (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{
                    rotate: isHovering ? [0, -15, 15, -10, 10, -5, 5, 0] : 0,
                  }}
                  transition={{
                    rotate: {
                      duration: 0.5,
                      times: [0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
                      ease: "easeInOut",
                      delay: 0.15,
                    },
                  }}
                >
                  <TbSwords className="h-4 w-4" />
                </motion.div>
              ),
              text: t("generate"),
            },
          }}
        />
      </Button>

      <div
        className={cn(
          "flex w-full flex-row items-center justify-between gap-x-6",
          isMobile ? "flex-col gap-y-2" : ""
        )}
      >
        <ModelSelect
          value={leftDisplay}
          models={getModelNameList()}
          randomValue={randomModelLeft}
          onChange={(value, actualModel) =>
            handleModelChange("left", value, actualModel)
          }
        />
        <ModelSelect
          value={rightDisplay}
          models={getModelNameList()}
          randomValue={randomModelRight}
          onChange={(value, actualModel) =>
            handleModelChange("right", value, actualModel)
          }
        />
      </div>
    </div>
  );
}
