import { get } from "radash";
import { useShallow } from "zustand/react/shallow";

import useSocketActions from "../../hooks/useSocketActions.tsx";
import usePlaygroundStore from "../../stores/playgroundStore.ts";
import RangeInput from "../RangeInput.tsx";

type ScaleEditorProps = {
  path: string;
};

export default function ScaleEditor({ path }: ScaleEditorProps) {
  const { updateProp } = useSocketActions();
  const { json } = usePlaygroundStore(
    useShallow(({ json }) => ({
      json,
    }))
  );

  const inputs = ["X", "Y", "Z"];

  return (
    <div className="space-y-4">
      {typeof get(json, `${path}.0`) === "number" ? (
        inputs.map((label, index) => (
          <div key={index} className="flex flex-col space-y-1">
            <span className="text-xs font-semibold text-gray-600">{label} Scale</span>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                step={1}
                value={get(json, `${path}.${index}`) || 100}
                min={0}
                className="w-16 p-2 border border-gray-300 rounded-md text-center text-sm font-mono text-gray-700"
                onChange={(e) =>
                  updateProp(`${path}.${index}`, Number(e.target.value))
                }
              />
              <RangeInput
                step={1}
                value={get(json, `${path}.${index}`) || 100}
                onChange={(e) =>
                  updateProp(`${path}.${index}`, Number(e.target.value))
                }
                min={0}
                max={300}
                className="flex-1 h-2 bg-gray-200 rounded-full"
                thumbClassName="w-4 h-4 bg-blue-500 rounded-full"
              />
            </div>
          </div>
        ))
      ) : (
        <div className="text-sm text-gray-500">This layer is not scalable.</div>
      )}
    </div>
  );
}
