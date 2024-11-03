import { useShallow } from "zustand/react/shallow";
import useSocketActions from "../../hooks/useSocketActions.tsx";
import usePlaygroundStore from "../../stores/playgroundStore.ts";
import RangeInput from "../RangeInput.tsx";

export default function Settings() {
  const { updateProp } = useSocketActions();

  const { json } = usePlaygroundStore(
    useShallow(({ json }) => ({
      json,
    }))
  );

  return (
    <div className="space-y-3 rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm text-t-text font-semibold">Speed</p>
        <p className="text-sm font-mono text-t-text bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
          {json?.fr?.toFixed(2)} fps
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <RangeInput
          type="range"
          min={0}
          max={200}
          value={json?.fr}
          step={1}
          onChange={(e) => {
            updateProp("fr", Number(e.target.value));
          }}
          className="flex-1 h-2 bg-gray-300 rounded-full"
        />
      </div>
    </div>
  );
}
