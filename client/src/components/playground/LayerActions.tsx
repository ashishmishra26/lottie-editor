import type { Layer } from "@lottiefiles/lottie-types";
import { get } from "radash";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import useSocketActions from "../../hooks/useSocketActions.tsx";
import usePlaygroundStore from "../../stores/playgroundStore.ts";
import { extractColorsFromLayer } from "../../utils/utils.ts";

import ColorEditor from "./ColorEditor.tsx";
import ScaleEditor from "./ScaleEditor.tsx";

type LayerActionsProps = {
  layerKey: string;
};

export default function LayerActions({ layerKey }: LayerActionsProps) {
  const [path, index] = [
    layerKey.split(".").slice(0, -1).join("."),
    Number(layerKey.split(".").slice(-1)[0]),
  ];

  const { deleteArrayItem } = useSocketActions();

  const { selectLayer, json } = usePlaygroundStore(
    useShallow(({ selectedLayers, selectLayer, json }) => ({
      selectedLayers,
      selectLayer,
      json,
    }))
  );

  function deleteLayer() {
    selectLayer(layerKey);
    deleteArrayItem(path, index);
  }

  const currentLayer = useMemo(
    () => get(json, layerKey) as Layer.Value,
    [layerKey, json]
  );

  const layerColors = useMemo(
    () => extractColorsFromLayer(currentLayer),
    [currentLayer]
  );

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm heading font-semibold text-t-text mb-1">
          Scale
        </div>
        <ScaleEditor path={`${layerKey}.ks.s.k`} />
      </div>

      {!!Object.keys(layerColors).length && (
        <div>
          <div className="text-sm heading font-semibold text-t-text mb-1">
            Colors
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(layerColors).map(([key, color]) => (
              <ColorEditor
                color={color}
                colorPath={`${layerKey}.${key}`}
                key={key}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        <button onClick={deleteLayer} className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Delete layer
        </button>
        <button
          onClick={() => selectLayer(layerKey)}
          className="w-full border border-black text-black font-bold py-2 px-4 rounded"
        >
          Remove selection
        </button>
      </div>
    </div>
  );
}
