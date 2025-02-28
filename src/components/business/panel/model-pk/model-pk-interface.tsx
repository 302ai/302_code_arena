"use client";

import { TypewriterText } from "@/components/ui/typewriter-text";
import { ModelPkForm } from "./model-pk-form/model-pk-form";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ModelPkResult } from "./model-pk-result/model-pk-result";
import { ModelVote } from "./model-vote/model-vote";
import { useAtomValue, useSetAtom } from "jotai";
import {
  pkStoreAtom,
  PkStoreStatus,
  updateSkip,
  updateWinner,
} from "@/stores/slices/pk_store";
import { useCallback } from "react";
import { useGenHistory } from "@/hooks/db/use-gen-history";
import { useIsMobile } from "@/hooks/global/use-mobile";
import { cn } from "@/lib/utils";
import { getModelNameById } from "@/constants/models";

export type App = {
  status: PkStoreStatus;
  isLoading: boolean;
  model: string;
  result: string;
  trimmedCode: string;
  totalTime: number;
  runCodeResult: string;
};

export function ModelPkInterface() {
  const t = useTranslations("modelPk");

  const isMobile = useIsMobile();

  const { updateHistory } = useGenHistory();

  const { id, leftApp, rightApp, winner, voted, skip, type } =
    useAtomValue(pkStoreAtom);
  const _updateWinner = useSetAtom(updateWinner);
  const _updateSkip = useSetAtom(updateSkip);

  const handleVote = useCallback(
    (model: string) => {
      _updateWinner(model);
      updateHistory(id, {
        winner: model,
        voted: true,
        skip: false,
      });
    },
    [_updateWinner, id, updateHistory]
  );

  const handleSkip = useCallback(() => {
    _updateSkip();
    updateHistory(id, {
      winner: "",
      voted: false,
      skip: true,
    });
  }, [_updateSkip, id, updateHistory]);

  const showVote =
    leftApp.status === "success" && rightApp.status === "success";

  const leftAppModelName =
    leftApp.display === "random"
      ? getModelNameById(leftApp.model)
      : leftApp.display;
  const rightAppModelName =
    rightApp.display === "random"
      ? getModelNameById(rightApp.model)
      : rightApp.display;

  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <h2
        className={cn(
          "text-4xl font-medium",
          isMobile && "text-center text-3xl"
        )}
      >
        {t("title")}
      </h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TypewriterText
          className={cn(
            "text-xl text-muted-foreground",
            isMobile && "text-base"
          )}
          loop
          text={t("description")}
        />
      </motion.div>
      <ModelPkForm />
      <ModelPkResult leftApp={leftApp} rightApp={rightApp} type={type} />
      <ModelVote
        showVote={showVote}
        voted={voted}
        skip={skip}
        winner={winner}
        leftModel={leftAppModelName}
        rightModel={rightAppModelName}
        onVote={handleVote}
        onSkip={handleSkip}
      />
    </div>
  );
}
