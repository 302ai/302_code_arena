import { useCallback, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { pkFormAtom } from "@/stores/slices/form_store";
import { getModelNameList, getModelIdByName } from "@/constants/models";

export function useGetModels() {
  const [randomModelLeft, setRandomModelLeft] = useState<string>("");
  const [randomModelRight, setRandomModelRight] = useState<string>("");

  const [pkForm, setPkForm] = useAtom(pkFormAtom);
  const { leftDisplay, rightDisplay } = pkForm;

  const updateRandomModels = useCallback(
    (side?: "left" | "right") => {
      const models = getModelNameList();

      if (models.length === 0) return;

      if (!side) {
        // Update both sides
        const [leftModelName, rightModelName] = getRandomModels(models);

        setRandomModelLeft(leftModelName);
        setRandomModelRight(rightModelName);
        return;
      }

      if (side === "left") {
        const [newLeftModelName] = getRandomModels(models);
        setRandomModelLeft(newLeftModelName);

        // If new left model happens to be same as right model, update right model
        if (newLeftModelName === randomModelRight && models.length > 1) {
          const [newRightModelName] = getRandomModels(models, [
            newLeftModelName,
          ]);
          setRandomModelRight(newRightModelName);
        }
      } else {
        const [newRightModelName] = getRandomModels(models);
        setRandomModelRight(newRightModelName);

        // If new right model happens to be same as left model, update left model
        if (newRightModelName === randomModelLeft && models.length > 1) {
          const [newLeftModelName] = getRandomModels(models, [
            newRightModelName,
          ]);
          setRandomModelLeft(newLeftModelName);
        }
      }
    },
    [randomModelLeft, randomModelRight]
  );

  useEffect(() => {
    const models = getModelNameList();

    if (models.length > 0) {
      const [leftModel, rightModel] = getRandomModels(models);

      setRandomModelLeft(leftModel);
      setRandomModelRight(rightModel);

      if (leftDisplay === "random" || rightDisplay === "random") {
        const modelIdLeft = getModelIdByName(leftModel);
        const modelIdRight = getModelIdByName(rightModel);

        setPkForm((prev) => ({
          ...prev,
          ...(leftDisplay === "random" && { leftModel: modelIdLeft }),
          ...(rightDisplay === "random" && { rightModel: modelIdRight }),
        }));
      }
    }
  }, [leftDisplay, rightDisplay, setPkForm]);

  return {
    randomModelLeft,
    randomModelRight,

    updateRandomModels,
  };
}

function getRandomModels(models: string[], exclude?: string[]) {
  const shuffled = models
    .filter((model) => !exclude?.includes(model))
    .sort(() => 0.5 - Math.random());

  return [shuffled[0], shuffled[1]];
}
