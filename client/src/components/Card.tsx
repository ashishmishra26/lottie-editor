import { Icon } from "@iconify/react";
import { Animation } from "@lottiefiles/lottie-types";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";

import useAPI from "../hooks/useAPI.tsx";
import { FeaturedAnimation } from "../types/types.ts";
import LottiePreview from "./LottiePreview.tsx";
import Skeleton from "./Skeleton.tsx";
import SkeletonText from "./SkeletonText.tsx";

function getFullName(firstName: string, lastName: string) {
  return `${firstName || ""} ${lastName || ""}`.trim();
}

type AnimationCardProps = {
  animation: FeaturedAnimation | null;
};

export default function Card({ animation }: AnimationCardProps) {
  const navigate = useNavigate();
  const { openPlaygroundForData } = useAPI();

  const { mutateAsync: openPlayground, isPending: playgroundIsOpening } =
    useMutation({
      mutationFn: async () => {
        if (!animation) {
          return;
        }

        const response = await fetch(animation.jsonUrl);
        const animationJSON = (await response.json()) as Animation;
        const playgroundUrl = await openPlaygroundForData(animationJSON);

        navigate(`/${playgroundUrl}`);
      },
    });

  const style = {
    card: "text-t-text-light rounded-xl group transition-opacity relative overflow-hidden",
    imageWrapper:
      "block pb-[100%] w-full relative h-0 border rounded-[0.875rem] overflow-hidden theme-neutral-light dark:theme-neutral bg transition-[border-color] group-hover:border-t-text",
    image: "absolute inset-px",
    noImage: "w-10 h-10 m-auto inset-0 absolute opacity-50",
    content: "mt-2.5",
    overlay:
      "absolute inset-x-0 bottom-0 flex flex-col p-4 transition-transform duration-300 ease-in-out transform translate-y-full opacity-90 bg-white bg-opacity-90 group-hover:translate-y-0 group-hover:opacity-100",
    name: "block font-bold text-sm lg:text-base transition-colors",
    author:
      "flex items-center gap-2 text-xs lg:text-sm mt-1.5 flex-1 overflow-hidden transition-colors hover:text-t-text",
    avatar: "w-4 h-4 rounded-full shrink-0",
    authorName: "truncate mt-1",
    likes: "flex text-sm items-center gap-1",
    likesIcon: "w-3 lg:w-4 h-3 lg:h-4",
    loaderIcon:
      "text-t-text absolute inset-0 m-auto w-10 h-10 z-[1] animate-spin",
  };

  return (
    <div
      className={clsx(style.card, {
        "opacity-50 pointer-events-none": playgroundIsOpening,
        "pointer-events-none": !animation,
      })}
    >
      {/* Preview */}
      <button
        type="button"
        className={style.imageWrapper}
        onClick={() => openPlayground()}
      >
        {!animation ? (
          <Skeleton fill />
        ) : animation.jsonUrl ? (
          <LottiePreview url={animation.jsonUrl} className={style.image} />
        ) : (
          <Icon icon="carbon:no-image" className={style.noImage} />
        )}

        {playgroundIsOpening && (
          <Icon icon="ri:loader-4-line" className={style.loaderIcon} />
        )}
      </button>

      {/* Overlay for Hover Effect */}
      <div className={style.overlay}>
        <div className="flex justify-between items-center">
          <div className={style.name}>
            {animation ? animation.name : <SkeletonText lines={1} />}
          </div>
          <div className={style.likes}>
            <Icon icon="ri:heart-line" className={style.likesIcon} />
            <span>
              {animation ? animation.likesCount : <SkeletonText fullWidth />}
            </span>
          </div>
        </div>
        {/* Author */}
        <a
          href={`https://lottiefiles.com${animation?.createdBy?.username}`}
          target="_blank"
          rel="noreferrer"
          className={style.author}
        >
          {animation ? (
            <img
              src={animation.createdBy.avatarUrl}
              alt={animation.createdBy.username}
              className={style.avatar}
            />
          ) : (
            <Skeleton className={style.avatar} />
          )}
          <div className={style.authorName}>
            {animation ? (
              getFullName(
                animation.createdBy.firstName,
                animation.createdBy.lastName
              )
            ) : (
              <SkeletonText fullWidth />
            )}
          </div>
        </a>
      </div>
    </div>
  );
}
