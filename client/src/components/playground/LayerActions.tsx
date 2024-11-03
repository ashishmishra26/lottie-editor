import type { Layer } from "@lottiefiles/lottie-types";
import { get } from "radash";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Icon } from "@iconify/react";

import useSocketActions from "../../hooks/useSocketActions.tsx";
import usePlaygroundStore from "../../stores/playgroundStore.ts";
import { extractColorsFromLayer } from "../../utils/utils.ts";

import ColorEditor from "./ColorEditor.tsx";
import ScaleEditor from "./ScaleEditor.tsx";

type LayerActionsProps = {
  layerKey: string;
};

export default function LayerActions({ layerKey }: LayerActionsProps) {
  const [isOpen, setIsOpen] = useState(true);

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

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 lg:bottom-8 left-0 lg:left-80 w-full lg:w-80 p-4 bg-white rounded-lg shadow-lg space-y-4 z-50">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">Layer Actions</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <Icon icon="ri:close-icon" />
        </button>
      </div>

      <div>
        <div className="text-sm font-semibold text-gray-700 mb-1">Scale</div>
        <ScaleEditor path={`${layerKey}.ks.s.k`} />
      </div>

      {!!Object.keys(layerColors).length && (
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-1">Colors</div>
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
        <button
          onClick={deleteLayer}
          className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete layer
        </button>
        <button
          onClick={() => selectLayer(layerKey)}
          className="w-full border border-gray-400 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-100"
        >
          Remove selection
        </button>
      </div>
    </div>
  );
}
