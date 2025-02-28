import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { SupportedGenType, SupportedType } from "./form_store";
export type PkStoreStatus = "idle" | "generating" | "success" | "failed";
export type PkStore = {
  id: string;
  prompt: string;
  type: SupportedGenType;
  leftApp: {
    status: PkStoreStatus;
    isLoading: boolean;
    model: string;
    display: string;
    result: string;
    trimmedCode: string;
    totalTime: number;
    runCodeResult: string;
  };
  rightApp: {
    status: PkStoreStatus;
    isLoading: boolean;
    model: string;
    display: string;
    result: string;
    trimmedCode: string;
    totalTime: number;
    runCodeResult: string;
  };
  winner: string;
  voted: boolean;
  skip: boolean;
};

const defaultPkStore: PkStore = {
  id: "",
  prompt: "",
  type: SupportedType.web,
  leftApp: {
    status: "idle",
    isLoading: false,
    model: "",
    display: "",
    result: "",
    trimmedCode: "",
    totalTime: 0,
    runCodeResult: "",
  },
  rightApp: {
    status: "idle",
    isLoading: false,
    model: "",
    display: "",
    result: "",
    trimmedCode: "",
    totalTime: 0,
    runCodeResult: "",
  },
  winner: "",
  voted: false,
  skip: false,
};

export const pkStoreAtom = atomWithStorage<PkStore>(
  "pkStore",
  defaultPkStore,
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

export const updateLeftResult = atom(null, (_get, set, result: string) => {
  set(pkStoreAtom, (prev) => ({
    ...prev,
    leftApp: {
      ...prev.leftApp,
      result,
    },
  }));
});

export const updateLeftTrimmedCode = atom(
  null,
  (_get, set, trimmedCode: string) => {
    set(pkStoreAtom, (prev) => ({
      ...prev,
      leftApp: {
        ...prev.leftApp,
        trimmedCode,
      },
    }));
  }
);
export const updateRightResult = atom(null, (_get, set, result: string) => {
  set(pkStoreAtom, (prev) => ({
    ...prev,
    rightApp: {
      ...prev.rightApp,
      result,
    },
  }));
});

export const updateRightTrimmedCode = atom(
  null,
  (_get, set, trimmedCode: string) => {
    set(pkStoreAtom, (prev) => ({
      ...prev,
      rightApp: {
        ...prev.rightApp,
        trimmedCode,
      },
    }));
  }
);

export const updateLeftStatus = atom(
  null,
  (_get, set, update: Partial<PkStore["leftApp"]>) => {
    set(pkStoreAtom, (prev) => ({
      ...prev,
      leftApp: {
        ...prev.leftApp,
        ...update,
      },
    }));
  }
);

export const updateRightStatus = atom(
  null,
  (_get, set, update: Partial<PkStore["rightApp"]>) => {
    set(pkStoreAtom, (prev) => ({
      ...prev,
      rightApp: {
        ...prev.rightApp,
        ...update,
      },
    }));
  }
);

export const updateWinner = atom(null, (_get, set, winner: string) => {
  set(pkStoreAtom, (prev) => ({
    ...prev,
    voted: true,
    winner,
  }));
});

export const updateSkip = atom(null, (_get, set) => {
  set(pkStoreAtom, (prev) => ({
    ...prev,
    skip: true,
  }));
});

export const resetPkStore = atom(null, (_get, set) => {
  set(pkStoreAtom, defaultPkStore);
});
