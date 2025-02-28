import { atomWithStorage, createJSONStorage } from "jotai/utils";

export const SupportedType = {
  // web: "web",
  html: "html",
  react: "react",
  python: "python3",
  "node.js": "nodejs",
} as const;

export type SupportedGenType =
  (typeof SupportedType)[keyof typeof SupportedType];

type FormStore = {
  prompt: string;
  type: SupportedGenType;
  leftDisplay: string;
  leftModel: string;
  rightDisplay: string;
  rightModel: string;
};

const defaultFormStore: FormStore = {
  prompt: "",
  type: "html",
  leftDisplay: "random",
  leftModel: "",
  rightDisplay: "random",
  rightModel: "",
};

export const pkFormAtom = atomWithStorage<FormStore>(
  "pkForm",
  defaultFormStore,
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
