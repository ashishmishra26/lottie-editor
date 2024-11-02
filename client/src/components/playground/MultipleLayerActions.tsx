import { useShallow } from "zustand/react/shallow";

import useSocketActions from "../../hooks/useSocketActions.tsx";
import usePlaygroundStore from "../../stores/playgroundStore.ts";

export default function MultipleLayerActions() {
  const { deleteArrayItem } = useSocketActions();
  const { selectedLayers, clearSelectedLayers } = usePlaygroundStore(
    useShallow(({ selectedLayers, clearSelectedLayers }) => ({
      selectedLayers,
      clearSelectedLayers,
    }))
  );

  function deleteLayers() {
    // Group indexes by path and sort indexes to avoid mistakes when removing
    // layers by the index (going from the end)
    const indexesToRemoveByPath = selectedLayers.reduce(
      (acc, layerKey) => {
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
      },
      {} as Record<string, number[]>
    );

    Object.entries(indexesToRemoveByPath).forEach(([path, indexes]) => {
      indexes.forEach((index) => {
        deleteArrayItem(path, index);
      });
    });

    clearSelectedLayers();
  }

  return (
    <div className="space-y-3">
      <button
        onClick={deleteLayers}
        className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"

      >
        Delete layers
        </button>
      <button
        onClick={clearSelectedLayers}
        className="w-full border border-black text-black font-bold py-2 px-4 rounded"
      >
        Remove selection
        </button>
    </div>
  );
}
