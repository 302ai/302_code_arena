import { atomWithStorage, createJSONStorage } from "jotai/utils";

export type UiStoreActiveTab = "modelPk" | "leaderboard" | "history";
export type UiStore = {
  activeTab: UiStoreActiveTab;
};

const defaultUiStore: UiStore = {
  activeTab: "modelPk",
};

export const uiStoreAtom = atomWithStorage<UiStore>(
  "uiStore",
  defaultUiStore,
  createJSONStorage(() =>
    typeof window !== "undefined"
      ? sessionStorage
      : {
          getItem: () => null,
          setItem: () => null,
          removeItem: () => null,
        }
  ),
  {
    getOnInit: true,
  }
);
