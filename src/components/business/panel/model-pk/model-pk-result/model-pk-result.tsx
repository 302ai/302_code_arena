import { useTranslations } from "next-intl";
import { AppWrapper } from "./app-wrapper";
import { useEffect, useState } from "react";
import { App } from "../model-pk-interface";
import { SupportedGenType } from "@/stores/slices/form_store";
import { useIsMobile } from "@/hooks/global/use-mobile";

interface ModelPkResultProps {
  type: SupportedGenType;
  leftApp: App;
  rightApp: App;
}

export function ModelPkResult({ leftApp, rightApp, type }: ModelPkResultProps) {
  const t = useTranslations("modelPk.pk_result");

  const isMobile = useIsMobile();

  const [selectedLeftAppTab, setSelectedLeftAppTab] = useState<
    "preview" | "code"
  >("preview");
  const [selectedRightAppTab, setSelectedRightAppTab] = useState<
    "preview" | "code"
  >("preview");

  useEffect(() => {
    if (leftApp.status === "success") {
      setSelectedLeftAppTab("preview");
    } else if (leftApp.status === "generating") {
      setSelectedLeftAppTab("code");
    }
  }, [leftApp.status]);

  useEffect(() => {
    if (rightApp.status === "success") {
      setSelectedRightAppTab("preview");
    } else if (rightApp.status === "generating") {
      setSelectedRightAppTab("code");
    }
  }, [rightApp.status]);

  return (
    <div
      className={`grid w-full ${
        isMobile ? "grid-cols-1 gap-y-6" : "grid-cols-2 gap-x-6"
      }`}
    >
      <AppWrapper
        selectedTab={selectedLeftAppTab}
        onTabSelect={(tab) => setSelectedLeftAppTab(tab as "preview" | "code")}
        placeholder={t("left_placeholder")}
        app={leftApp}
        type={type}
        label={`${t("left_placeholder")}：`}
      />

      <AppWrapper
        selectedTab={selectedRightAppTab}
        onTabSelect={(tab) => setSelectedRightAppTab(tab as "preview" | "code")}
        placeholder={t("right_placeholder")}
        app={rightApp}
        type={type}
        label={`${t("right_placeholder")}：`}
      />
    </div>
  );
}
