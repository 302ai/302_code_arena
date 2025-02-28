"use client";

import { Button } from "@/components/ui/button";
import { LuChevronLast } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { ModelDisplay } from "./model-display";
import { toast } from "sonner";
import { useConfig } from "@/hooks/config";
import { createScopedLogger } from "@/utils/logger";
import { updateLeaderboard } from "@/utils/leaderboard";
import { useIsMobile } from "@/hooks/global/use-mobile";
import { cn } from "@/lib/utils";
const logger = createScopedLogger("ModelVote");

interface ModelVoteProps {
  showVote: boolean;
  voted: boolean;
  skip: boolean;
  leftModel: string;
  rightModel: string;
  winner: string;
  onVote: (model: string) => void;
  onSkip: () => void;
}

export function ModelVote({
  showVote,
  voted,
  skip,
  winner,
  leftModel,
  rightModel,
  onVote,
  onSkip,
}: ModelVoteProps) {
  const t = useTranslations("modelPk.vote");

  const { fetchConfig, updateConfigValues, isReady } = useConfig();

  const isMobile = useIsMobile();

  const leftWin = winner === leftModel;
  const rightWin = winner === rightModel;
  const disabled = voted || skip;
  const showModelNames = voted || skip;

  const updateCloudConfig = async (winner: string) => {
    if (!isReady) return;
    try {
      const config = await fetchConfig();
      const currentLeaderboard = config.config.codeArenaLeaderboard || [];

      if (winner) {
        // Only update leaderboard if not skipped
        const newLeaderboard = updateLeaderboard(currentLeaderboard, {
          modelA: leftModel,
          modelB: rightModel,
          winner,
        });

        await updateConfigValues(
          {
            codeArenaLeaderboard: newLeaderboard,
          },
          config.version
        );
      }
    } catch (error) {
      logger.error("Failed to update cloud config:", error);
      toast.error(t("error.update_leaderboard_failed"));
    }
  };

  const handleVote = (model: string) => {
    onVote(model);
    updateCloudConfig(model);
  };

  if (!showVote) return null;

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div
        className={cn(
          "grid w-full grid-cols-2 gap-x-6 pt-4",
          isMobile ? "grid-cols-1 gap-y-2" : ""
        )}
      >
        <ModelDisplay
          label={t("model_left")}
          modelName={leftModel}
          isWinner={leftWin}
          showModelName={showModelNames}
        />
        <ModelDisplay
          label={t("model_right")}
          modelName={rightModel}
          isWinner={rightWin}
          showModelName={showModelNames}
        />
      </div>

      {/* <span className="my-10 text-center text-3xl text-foreground">
        {t("vote_description")}
      </span> */}

      {!isMobile ? (
        <div className="mt-4 flex w-full flex-row items-center justify-center gap-x-4">
          <Button
            variant="default"
            onClick={() => handleVote(leftModel)}
            disabled={disabled}
          >
            {t("vote_left")}
          </Button>
          <Button variant="secondary" disabled={disabled} onClick={onSkip}>
            <LuChevronLast />
            {t("skip")}
          </Button>
          <Button
            variant="default"
            onClick={() => handleVote(rightModel)}
            disabled={disabled}
          >
            {t("vote_right")}
          </Button>
        </div>
      ) : (
        <div className="mt-4 flex w-full flex-col items-center justify-center gap-y-2">
          <Button
            variant="default"
            onClick={() => handleVote(leftModel)}
            disabled={disabled}
          >
            {t("vote_left")}
          </Button>{" "}
          <Button
            variant="default"
            onClick={() => handleVote(rightModel)}
            disabled={disabled}
          >
            {t("vote_right")}
          </Button>
          <Button variant="secondary" disabled={disabled} onClick={onSkip}>
            <LuChevronLast />
            {t("skip")}
          </Button>
        </div>
      )}
    </div>
  );
}
