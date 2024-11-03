import { Animation } from "@lottiefiles/lottie-types";
import { useMutation } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import useAPI from "../hooks/useAPI.tsx";
import { parseJsonFile } from "../utils/utils.ts";

export default function Upload() {
  const navigate = useNavigate();
  const { openPlaygroundForData } = useAPI();
  const input = useRef<HTMLInputElement>(null);

  const {
    mutateAsync: openPlaygroundForFile,
    isPending: playgroundIsOpening,
    error,
  } = useMutation({
    mutationFn: async (variables: FileList | null) => {
      if (!variables) {
        return;
      }

      const json = (await parseJsonFile(variables[0])) as Animation;
      const playgroundUrl = await openPlaygroundForData(json);
      navigate(`/${playgroundUrl}`);
    },
  });

  const style = {
    title: "heading text-xl lg:text-3xl font-bold text-t-text",
    description: "text-base lg:text-xl mt-3 lg:mt-5",
    buttonWrapper:
      "flex flex-col just justify-center items-center gap-4 lg:gap-6 border-dashed border-2 border-t-border rounded-xl p-6",
    uploadBtn:
      "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded",
    error:
      "text-sm theme-error text-t-text bg-t-bg px-3 leading-relaxed py-1 rounded-xl",
  };

  return (
    <div className="h-full">
      <div className={style.buttonWrapper}>
        <h2 className={style.title}>Upload the animation JSON</h2>
        <button
          className={style.uploadBtn}
          onClick={() => input.current?.click()}
        >
          {playgroundIsOpening ? (
            <span>Loading...</span>
          ) : (
            <span>
              <Icon icon="ri:upload-line" className="inline mr-2" />
              Upload
            </span>
          )}
        </button>

        <input
          type="file"
          className="hidden"
          onChange={(e) => openPlaygroundForFile(e.target.files)}
          ref={input}
          accept="application/json"
        />

        {!!error && (
          <div className={style.error}>
            Failed to parse JSON, Please try again.
          </div>
        )}
      </div>
    </div>
  );
}
