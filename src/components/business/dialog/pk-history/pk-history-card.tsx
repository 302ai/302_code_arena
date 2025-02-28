"use client";

import { History } from "@/db/types";
import { cn } from "@/lib/utils";
import { useAtom, useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import { TbSwords } from "react-icons/tb";
import { pkStoreAtom, resetPkStore } from "@/stores/slices/pk_store";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
import { getModelNameById } from "@/constants/models";
import { SupportedGenType } from "@/stores/slices/form_store";

interface PkHistoryCardProps {
  item: History;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export function PkHistoryCard({ item, onClick, onDelete }: PkHistoryCardProps) {
  const t = useTranslations("pk_history");

  const [pkStore, setPkStore] = useAtom(pkStoreAtom);
  const _resetPkStore = useSetAtom(resetPkStore);

  const { id, prompt, type, leftApp, rightApp, winner, voted, skip } = item;

  const handleClick = () => {
    const {
      status: leftStatus,
      model: leftModel,
      display: leftDisplay,
      result: leftResult,
      trimmedCode: leftTrimmedCode,
      totalTime: leftTotalTime,
      runCodeResult: leftRunCodeResult,
    } = leftApp;
    const {
      status: rightStatus,
      model: rightModel,
      display: rightDisplay,
      result: rightResult,
      trimmedCode: rightTrimmedCode,
      totalTime: rightTotalTime,
      runCodeResult: rightRunCodeResult,
    } = rightApp;

    setPkStore((prev) => ({
      ...prev,
      id,
      leftApp: {
        status: leftStatus,
        model: leftModel,
        display: leftDisplay,
        isLoading: false,
        result: leftResult,
        trimmedCode: leftTrimmedCode,
        totalTime: leftTotalTime,
        runCodeResult: leftRunCodeResult,
      },
      rightApp: {
        status: rightStatus,
        model: rightModel,
        display: rightDisplay,
        isLoading: false,
        result: rightResult,
        trimmedCode: rightTrimmedCode,
        totalTime: rightTotalTime,
        runCodeResult: rightRunCodeResult,
      },
      winner,
      voted,
      skip,
      type: type as SupportedGenType,
    }));
    onClick();
  };

  const handleDelete = (
    id: string,
    e: React.MouseEvent<SVGElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (pkStore.id === id) {
      _resetPkStore();
    }

    onDelete(id);
  };

  const leftAppModelName =
    leftApp.display === "random"
      ? getModelNameById(leftApp.model)
      : leftApp.display;
  const rightAppModelName =
    rightApp.display === "random"
      ? getModelNameById(rightApp.model)
      : rightApp.display;

  return (
    <div className="group relative flex flex-shrink-0 cursor-pointer flex-col gap-y-6 overflow-hidden rounded-md border border-border p-6 hover:bg-muted/50">
      <div className="absolute bottom-0 right-0 top-0 flex w-[40px] translate-x-full flex-col items-center justify-center gap-4 bg-transparent opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
        <FaCheck
          className="cursor-pointer text-green-600 hover:text-green-600/80"
          onClick={handleClick}
        />
        <FaRegTrashCan
          className="cursor-pointer text-red-600 hover:text-red-600/80"
          onClick={(e) => handleDelete(id, e)}
        />
      </div>
      <div className="flex w-full flex-col gap-y-6 transition-all duration-300 ease-out group-hover:pr-6">
        <div className="flex flex-row justify-between">
          <div className="flex min-w-0 flex-row gap-2 text-sm text-muted-foreground">
            <span className="flex-shrink-0">{t("prompt")}</span>
            <span className="truncate">{prompt}</span>
          </div>
          <div className="flex flex-shrink-0 flex-row gap-2 text-sm text-muted-foreground">
            <span>{t("type")}</span>
            <span>{type}</span>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div
            className={cn(
              "flex flex-row gap-2 text-sm text-muted-foreground",
              winner === leftAppModelName && "text-primary"
            )}
          >
            <span className="flex-shrink-0">{t("modelA")}</span>
            <span className="truncate">
              {!voted && !skip ? "******" : getModelNameById(leftApp.model)}
            </span>
          </div>
          <TbSwords className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <div
            className={cn(
              "flex flex-row gap-2 text-sm text-muted-foreground",
              winner === rightAppModelName && "text-primary"
            )}
          >
            <span className="flex-shrink-0">{t("modelB")}</span>
            <span className="truncate">
              {!voted && !skip ? "******" : getModelNameById(rightApp.model)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
