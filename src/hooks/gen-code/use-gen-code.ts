import { pkFormAtom, SupportedType } from "@/stores/slices/form_store";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { createScopedLogger } from "@/utils/logger";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { readStreamableValue } from "ai/rsc";
import {
  pkStoreAtom,
  updateLeftStatus,
  updateLeftTrimmedCode,
  updateRightStatus,
  updateRightTrimmedCode,
} from "@/stores/slices/pk_store";
import { useGenHistory } from "../db/use-gen-history";
import { appConfigAtom } from "@/stores/slices/config_store";
import { languageAtom, store } from "@/stores";
import { useThrottleFn } from "ahooks";
import { getCodeFromLLM } from "@/api/chat";
import { runCode } from "@/services/run-code";
import { emitter } from "@/utils/mitt";
import { langToCountry } from "@/utils/302";

const logger = createScopedLogger("useGenCode");

interface UseGenCodeProps {
  randomModelLeft: string;
  randomModelRight: string;
  updateRandomModels: (side?: "left" | "right") => void;
}

export function useGenCode({
  randomModelLeft,
  randomModelRight,
  updateRandomModels,
}: UseGenCodeProps) {
  const t = useTranslations("modelPk.pk_form");

  const uiLanguage = store.get(languageAtom);

  const {
    addHistory,
    updateHistory,
    updateLeftAppStatus,
    updateRightAppStatus,
    updateLeftAppRunCodeResult,
    updateRightAppRunCodeResult,
  } = useGenHistory();

  const [pkForm, setPkForm] = useAtom(pkFormAtom);
  const [, setPkStore] = useAtom(pkStoreAtom);
  const _updateLeftStatus = useSetAtom(updateLeftStatus);
  const _updateRightStatus = useSetAtom(updateRightStatus);
  const _updateLeftTrimmedCode = useSetAtom(updateLeftTrimmedCode);
  const _updateRightTrimmedCode = useSetAtom(updateRightTrimmedCode);

  const [isGenerating, setIsGenerating] = useState(false);
  const [leftDisplay, setLeftDisplay] = useState(pkForm.leftDisplay);
  const [rightDisplay, setRightDisplay] = useState(pkForm.rightDisplay);

  const { run: throttledUpdateLeftTrimmedCode } = useThrottleFn(
    (leftResult: string) => {
      _updateLeftTrimmedCode(trimCode(leftResult));
    },
    { wait: 50 }
  );
  const { run: throttledUpdateRightTrimmedCode } = useThrottleFn(
    (rightResult: string) => {
      _updateRightTrimmedCode(trimCode(rightResult));
    },
    { wait: 50 }
  );

  const handleModelChange = useCallback(
    (side: "left" | "right", value: string, actualModel: string) => {
      logger.info(
        `handleModelChange: side=${side}, display=${value}, model=${actualModel}`
      );

      const { leftDisplay, leftModel, rightDisplay, rightModel } = pkForm;
      const isRandom = value === "random";

      if (side === "left") {
        if (isRandom) {
          updateRandomModels("left");
        }

        setPkForm((prev) => ({
          ...prev,
          leftDisplay: value,
          leftModel: actualModel,
        }));
        setLeftDisplay(value);

        if (rightDisplay === "random" || rightModel === actualModel) {
          updateRandomModels("right");
          setPkForm((prev) => ({
            ...prev,
            rightModel: randomModelRight,
            rightDisplay: "random",
          }));
          setRightDisplay("random");
        }
      } else {
        if (isRandom) {
          updateRandomModels("right");
        }

        setPkForm((prev) => ({
          ...prev,
          rightDisplay: value,
          rightModel: actualModel,
        }));
        setRightDisplay(value);

        if (leftDisplay === "random" || leftModel === actualModel) {
          updateRandomModels("left");
          setPkForm((prev) => ({
            ...prev,
            leftModel: randomModelLeft,
            leftDisplay: "random",
          }));
          setLeftDisplay("random");
        }
      }
    },
    [pkForm, randomModelLeft, randomModelRight, setPkForm, updateRandomModels]
  );

  function trimCode(code: string) {
    let trimmedCode = code.trim();
    trimmedCode = trimmedCode.split("\n")[0]?.startsWith("```")
      ? trimmedCode.split("\n").slice(1).join("\n")
      : trimmedCode;
    trimmedCode = trimmedCode.split("\n").at(-1)?.startsWith("```")
      ? trimmedCode.split("\n").slice(0, -1).join("\n")
      : trimmedCode;

    return trimmedCode;
  }

  const handleGenerate = useCallback(async () => {
    const { type, prompt, leftModel, leftDisplay, rightModel, rightDisplay } =
      pkForm;
    if (!type) {
      toast.error(t("error.no_type"));
      return;
    }
    if (!prompt || prompt.trim() === "") {
      toast.error(t("error.no_prompt"));
      return;
    }
    if (!leftModel || !rightModel) {
      toast.error(t("error.no_model"));
      return;
    }

    const { apiKey } = store.get(appConfigAtom);
    setIsGenerating(true);

    try {
      let quotaErrorCount = 1;
      const [leftResultStream, rightResultStream] = await Promise.all([
        getCodeFromLLM({
          type,
          prompt,
          model: leftModel,
          apiKey: apiKey || "",
        }),
        getCodeFromLLM({
          type,
          prompt,
          model: rightModel,
          apiKey: apiKey || "",
        }),
      ]);

      const id = await addHistory({
        prompt,
        type,
        leftApp: {
          status: "generating",
          display: leftDisplay,
          model: leftModel,
          result: "",
          trimmedCode: "",
          totalTime: 0,
          runCodeResult: "",
        },
        rightApp: {
          status: "generating",
          display: rightDisplay,
          model: rightModel,
          result: "",
          trimmedCode: "",
          totalTime: 0,
          runCodeResult: "",
        },
        winner: "",
        voted: false,
        skip: false,
      });

      setPkStore({
        id,
        prompt,
        type,
        leftApp: {
          status: "generating",
          isLoading: true,
          model: leftModel,
          display: leftDisplay,
          result: "",
          trimmedCode: "",
          totalTime: 0,
          runCodeResult: "",
        },
        rightApp: {
          status: "generating",
          isLoading: true,
          model: rightModel,
          display: rightDisplay,
          result: "",
          trimmedCode: "",
          totalTime: 0,
          runCodeResult: "",
        },
        winner: "",
        voted: false,
        skip: false,
      });

      const startTime = Date.now();

      const [leftResult, rightResult] = await Promise.allSettled([
        (async () => {
          if (!leftResultStream) return;
          try {
            if (leftResultStream.output) {
              let code = "";
              for await (const chunk of readStreamableValue(
                leftResultStream.output
              )) {
                code = code + (chunk ?? "");
                throttledUpdateLeftTrimmedCode(code);
              }
              const totalTime = (Date.now() - startTime) / 1000;
              const trimmedCode = trimCode(code);
              _updateLeftStatus({
                status: "success",
                isLoading: false,
                result: code,
                totalTime,
                trimmedCode,
              });
              updateHistory(id, {
                leftApp: {
                  status: "success",
                  display: leftDisplay,
                  model: leftModel,
                  result: code,
                  trimmedCode,
                  totalTime,
                  runCodeResult: "",
                },
              });

              if (
                type === SupportedType.python ||
                type === SupportedType["node.js"]
              ) {
                _updateLeftStatus({
                  status: "generating",
                });
                updateLeftAppStatus(id, "generating");

                runCode({
                  language: type,
                  code: cleanCode(leftModel, trimmedCode),
                }).then(
                  (result) => {
                    _updateLeftStatus({
                      status: "success",
                      runCodeResult: result.data.stdout,
                    });
                    updateLeftAppStatus(id, "success");
                    updateLeftAppRunCodeResult(id, result.data.stdout);
                  },
                  () => {
                    _updateLeftStatus({
                      status: "failed",
                    });
                    updateLeftAppStatus(id, "failed");
                  }
                );
              }
            }
          } catch (error: any) {
            if (
              error?.message?.error?.err_code === -10018 &&
              quotaErrorCount === 1
            ) {
              quotaErrorCount--;
              const countryCode = langToCountry(uiLanguage);
              const message =
                error.message.error[
                  `message${countryCode && countryCode !== "en" ? `_${countryCode}` : ""}`
                ];

              emitter.emit("ToastError", {
                code: error.message.error.err_code,
                message,
              });
            }

            logger.error(`generateLeftCode error: `, error);
            _updateLeftStatus({
              status: "failed",
              isLoading: false,
              totalTime: 0,
              result: "",
            });
            updateLeftAppStatus(id, "failed");
          }
        })(),
        (async () => {
          if (!rightResultStream) return;
          try {
            if (rightResultStream.output) {
              let code = "";
              for await (const chunk of readStreamableValue(
                rightResultStream.output
              )) {
                code = code + (chunk ?? "");
                throttledUpdateRightTrimmedCode(code);
              }
              const totalTime = (Date.now() - startTime) / 1000;
              const trimmedCode = trimCode(code);
              _updateRightStatus({
                status: "success",
                isLoading: false,
                result: code,
                totalTime,
                trimmedCode,
              });
              updateHistory(id, {
                rightApp: {
                  status: "success",
                  display: rightDisplay,
                  model: rightModel,
                  result: code,
                  trimmedCode,
                  totalTime,
                  runCodeResult: "",
                },
              });

              if (
                type === SupportedType.python ||
                type === SupportedType["node.js"]
              ) {
                _updateRightStatus({
                  status: "generating",
                });
                updateRightAppStatus(id, "generating");

                runCode({
                  language: type,
                  code: cleanCode(rightModel, trimmedCode),
                }).then(
                  (result) => {
                    logger.info(
                      `generateRightCode result: `,
                      result.data.stdout
                    );
                    _updateRightStatus({
                      status: "success",
                      runCodeResult: result.data.stdout,
                    });
                    updateRightAppStatus(id, "success");
                    updateRightAppRunCodeResult(id, result.data.stdout);
                  },
                  () => {
                    _updateRightStatus({
                      status: "failed",
                    });
                    updateRightAppStatus(id, "failed");
                  }
                );
              }
            }
          } catch (error: any) {
            if (
              error?.message?.error?.err_code === -10018 &&
              quotaErrorCount === 1
            ) {
              quotaErrorCount--;
              const countryCode = langToCountry(uiLanguage);
              const message =
                error.message.error[
                  `message${countryCode && countryCode !== "en" ? `_${countryCode}` : ""}`
                ];

              emitter.emit("ToastError", {
                code: error.message.error.err_code,
                message,
              });
            }

            logger.error(`generateRightCode error: `, error);
            _updateRightStatus({
              status: "failed",
              isLoading: false,
              totalTime: 0,
              result: "",
            });
            updateRightAppStatus(id, "failed");
          }
        })(),
      ]);

      if (
        leftResult.status !== "fulfilled" &&
        rightResult.status !== "fulfilled"
      ) {
        throw new Error("generateCode failed");
      }
    } catch (error) {
      logger.error(`generateCode error: `, error);
      toast.error(t("error.generate_failed"));
    } finally {
      logger.info(`generateCode finally: `, leftDisplay, rightDisplay);
      if (leftDisplay === "random" || rightDisplay === "random") {
        updateRandomModels();
        setPkForm((prev) => ({
          ...prev,
          ...(leftDisplay === "random" && { leftModel: randomModelLeft }),
          ...(rightDisplay === "random" && { rightModel: randomModelRight }),
        }));
      }

      setIsGenerating(false);
    }
  }, [
    pkForm,
    t,
    addHistory,
    setPkStore,
    _updateLeftStatus,
    updateHistory,
    throttledUpdateLeftTrimmedCode,
    updateLeftAppStatus,
    updateLeftAppRunCodeResult,
    uiLanguage,
    _updateRightStatus,
    throttledUpdateRightTrimmedCode,
    updateRightAppStatus,
    updateRightAppRunCodeResult,
    updateRandomModels,
    setPkForm,
    randomModelLeft,
    randomModelRight,
  ]);

  return {
    leftDisplay,
    rightDisplay,
    isGenerating,

    handleModelChange,
    handleGenerate,
  };
}

const cleanCode = (model: string, code: string) => {
  if (model === "o1-2024-12-17") {
    const codeStart = code.search(
      /(import|export|const|let|var|function|class|interface|type)\s/
    );
    return code.slice(codeStart);
  }
  return code;
};
