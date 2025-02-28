import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import { History } from "@/db/types";
import { useCallback } from "react";
import { AddHistory } from "@/db/types";

const PAGE_SIZE = 20;

type Status = "idle" | "generating" | "success" | "failed";

export function useGenHistory(page = 1) {
  const offset = (page - 1) * PAGE_SIZE;

  const statusFilter = (item: History) => {
    const {
      leftApp: { status: leftStatus },
      rightApp: { status: rightStatus },
    } = item;

    return (
      leftStatus !== "failed" &&
      rightStatus !== "failed" &&
      !(leftStatus === "generating" || rightStatus === "generating")
    );
  };

  const pkHistory = useLiveQuery(async () => {
    const pkHistory = await db.history
      .orderBy("createdAt")
      .filter(statusFilter)
      .reverse()
      .offset(offset)
      .limit(PAGE_SIZE)
      .toArray();
    return pkHistory;
  }, [page]);

  const history = useLiveQuery(async () => {
    const [items, total] = await Promise.all([
      db.history
        .orderBy("createdAt")
        .filter(statusFilter)
        .reverse()
        .offset(offset)
        .limit(PAGE_SIZE)
        .toArray(),
      db.history.filter(statusFilter).count(),
    ]);

    return {
      items,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
      currentPage: page,
    };
  }, [page]);

  const addHistory = useCallback(async (history: AddHistory) => {
    const id = crypto.randomUUID();
    await db.history.add({
      ...history,
      id,
      createdAt: Date.now(),
    });
    return id;
  }, []);

  const updateHistory = useCallback((id: string, history: Partial<History>) => {
    db.history.update(id, history);
  }, []);

  const deleteHistory = useCallback((id: string) => {
    db.history.delete(id);
  }, []);

  const updateLeftAppStatus = useCallback((id: string, status: Status) => {
    db.history.update(id, {
      "leftApp.status": status,
    });
  }, []);

  const updateRightAppStatus = useCallback((id: string, status: Status) => {
    db.history.update(id, {
      "rightApp.status": status,
    });
  }, []);

  const updateLeftAppRunCodeResult = useCallback(
    (id: string, result: string) => {
      db.history.update(id, {
        "leftApp.runCodeResult": result,
      });
    },
    []
  );

  const updateRightAppRunCodeResult = useCallback(
    (id: string, result: string) => {
      db.history.update(id, {
        "rightApp.runCodeResult": result,
      });
    },
    []
  );

  return {
    pkHistory,
    history,

    addHistory,
    updateHistory,
    deleteHistory,
    updateLeftAppStatus,
    updateRightAppStatus,
    updateLeftAppRunCodeResult,
    updateRightAppRunCodeResult,
  };
}
