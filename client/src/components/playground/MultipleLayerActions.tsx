import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Icon } from "@iconify/react";

import useSocketActions from "../../hooks/useSocketActions.tsx";
import usePlaygroundStore from "../../stores/playgroundStore.ts";

export default function MultipleLayerActions({ count }: { count: number }) {
  const [isOpen, setIsOpen] = useState(true);

  const { deleteArrayItem } = useSocketActions();
  const { selectedLayers, clearSelectedLayers } = usePlaygroundStore(
    useShallow(({ selectedLayers, clearSelectedLayers }) => ({
      selectedLayers,
      clearSelectedLayers,
    }))
  );

  function deleteLayers() {
    const indexesToRemoveByPath = selectedLayers.reduce((acc, layerKey) => {
      const [path, index] = [
        layerKey.split(".").slice(0, -1).join("."),
        Number(layerKey.split(".").slice(-1)[0]),
      ];

      if (acc[path]) {
        acc[path] = [...acc[path], index].sort((a, b) => b - a);
        return acc;
      }

      acc[path] = [index];
      return acc;
    }, {} as Record<string, number[]>);

    Object.entries(indexesToRemoveByPath).forEach(([path, indexes]) => {
      indexes.forEach((index) => {
        deleteArrayItem(path, index);
      });
    });

    clearSelectedLayers();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-8 left-80 w-80 p-4 bg-white rounded-lg shadow-lg space-y-3 z-50">
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

      <button
        onClick={deleteLayers}
        className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Delete {count} layers
      </button>
      <button
        onClick={clearSelectedLayers}
        className="w-full border border-gray-400 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-100"
      >
        Remove selection
      </button>
    </div>
  );
}
