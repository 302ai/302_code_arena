"use client";

import { History } from "@/db/types";
import { PkHistoryCard } from "./pk-history-card";

interface PkHistoryListProps {
  history: History[];
  onClick: () => void;
  onDelete: (id: string) => void;
}

export function PkHistoryList({
  history,
  onClick,
  onDelete,
}: PkHistoryListProps) {
  return (
    <div className="flex flex-col gap-y-4 overflow-y-auto">
      {history.map((item) => (
        <PkHistoryCard
          key={item.id}
          item={item}
          onClick={onClick}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
