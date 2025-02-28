"use client";

import { useConfig } from "@/hooks/config";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ModelStats } from "@/utils/leaderboard";
import { Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LeaderBoardInterface() {
  const t = useTranslations("leaderBoard");

  const [modelStats, setModelStats] = useState<ModelStats[]>([]);

  const { fetchConfig, isReady } = useConfig();

  useEffect(() => {
    if (isReady) {
      const getInitialConfig = async () => {
        const config = await fetchConfig();
        setModelStats(config.config.codeArenaLeaderboard || []);
      };
      getInitialConfig();
    }
  }, [isReady, fetchConfig]);

  if (modelStats.length === 0) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-2 p-4 text-center text-sm text-muted-foreground">
        <Medal className="h-8 w-8 opacity-50" />
        {t("empty")}
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col gap-4">
      <div className="@container">
        <div className="rounded-lg border bg-card text-card-foreground">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">{t("rank")}</TableHead>
                <TableHead className="w-[23%] text-center">
                  {t("name")}
                </TableHead>
                <TableHead className="w-[23%] text-center">
                  {t("winRate")}
                </TableHead>
                <TableHead className="w-[23%] text-center">
                  {t("score")}
                </TableHead>
                <TableHead className="w-[23%] text-center">
                  {t("appearances")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelStats.map((stats, index) => {
                const model = stats.modelId;
                if (!model) return null;

                return (
                  <TableRow
                    key={stats.modelId}
                    className={cn("h-14", index === 0 && "bg-primary/5")}
                  >
                    <TableCell className="w-[50px]">
                      <div className="flex items-center justify-center gap-1">
                        {index < 3 && (
                          <Medal
                            className={cn(
                              "h-5 w-5",
                              index === 0 && "text-yellow-500",
                              index === 1 && "text-gray-400",
                              index === 2 && "text-amber-600"
                            )}
                          />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {index + 1}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{model}</TableCell>
                    <TableCell className="text-center">
                      {stats.winRate.toFixed(0)}%
                    </TableCell>
                    <TableCell className="text-center">
                      {stats.totalScore}
                    </TableCell>
                    <TableCell className="text-center">
                      {stats.pkCount}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
