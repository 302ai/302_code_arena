"use client";

import { createScopedLogger } from "@/utils/logger";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uiStoreAtom, UiStoreActiveTab } from "@/stores/slices/ui_sotre";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ModelPkInterface } from "@/components/business/panel/model-pk/model-pk-interface";
import { PkHistoryInterface } from "@/components/business/dialog/pk-history/pk-history-interface";
import LeaderBoardInterface from "@/components/business/panel/leader-board/leader-board-interface";

const TABS_TRIGGER_CLASS =
  "relative rounded-none py-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:transition-all after:duration-300 after:ease-out data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:w-full data-[state=active]:after:bg-primary";

const logger = createScopedLogger("Home");

export default function Home() {
  const t = useTranslations("home");

  useEffect(() => {
    logger.info("Hello, Welcome to 302.AI");
  }, []);

  const [uiStore, setUiStore] = useAtom(uiStoreAtom);

  return (
    <div className="grid flex-1">
      <div className="container relative mx-auto flex h-full max-w-[1440px] flex-col items-center gap-4 rounded-lg border bg-background px-6 py-4 shadow-sm">
        <Tabs
          defaultValue={uiStore.activeTab}
          onValueChange={(value) =>
            setUiStore((prev) => ({
              ...prev,
              activeTab: value as UiStoreActiveTab,
            }))
          }
          className="flex size-full flex-col"
        >
          <TabsList className="h-auto w-fit rounded-none bg-transparent p-0">
            <TabsTrigger className={TABS_TRIGGER_CLASS} value="modelPk">
              <span
                className={cn(
                  uiStore.activeTab === "modelPk" && "text-primary"
                )}
              >
                {t("tabs.modelPk")}
              </span>
            </TabsTrigger>
            <TabsTrigger className={TABS_TRIGGER_CLASS} value="leaderboard">
              <span
                className={cn(
                  "text-sm font-medium",
                  uiStore.activeTab === "leaderboard" && "text-primary"
                )}
              >
                {t("tabs.leaderboard")}
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="modelPk">
            <ModelPkInterface />
          </TabsContent>
          <TabsContent value="leaderboard">
            <LeaderBoardInterface />
          </TabsContent>
        </Tabs>

        {uiStore.activeTab === "modelPk" && <PkHistoryInterface />}
      </div>
    </div>
  );
}
