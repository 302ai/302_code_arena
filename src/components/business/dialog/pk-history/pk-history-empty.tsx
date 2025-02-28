"use client";

import { Library } from "lucide-react";
import { useTranslations } from "next-intl";

export function PkHistoryEmpty() {
  const t = useTranslations("pk_history");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
      <Library className="size-8 text-muted-foreground" />
      <div className="text-muted-foreground">{t("no_records")}</div>
    </div>
  );
}
