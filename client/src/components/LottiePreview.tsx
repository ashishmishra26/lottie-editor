import { Icon } from "@iconify/react";
import { Animation } from "@lottiefiles/lottie-types";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Lottie from "lottie-react";

type LottiePreviewProps = {
  url: string;
  className?: string;
};

export default function LottiePreview({ url, className }: LottiePreviewProps) {
  const { data, isFetched } = useQuery({
    queryKey: [url],
    queryFn: async () => {
      const response = await fetch(url);
      return (await response.json()) as Animation;
    },
  });

  if (!isFetched || !data) {
    return (
      <div className={clsx(className, "flex items-center justify-center")}>
        <Icon
          icon={!isFetched ? "ri:loader-4-line" : "carbon:no-image"}
          className={clsx("w-10 h-10 m-auto inset-0 absolute opacity-50", {
            "animate-spin": !isFetched,
          })}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <Icon
        icon="carbon:no-image"
        className="w-10 h-10 m-auto absolute inset-0 opacity-50"
      />
    );
  }

  return <Lottie animationData={data} loop={true} className={className} />;
}
