import { Animation } from "@lottiefiles/lottie-types";

import type { Playground } from "../types/types.ts";
import { FeaturedAnimationsListResponseData } from "../types/types.ts";

export default function useAPI() {
  const getFeaturedAnimations = async ({
    pageParam,
  }: {
    pageParam: string;
  }) => {
    const url = new URL(
      `${import.meta.env.VITE_API_ENDPOINT}/v1/featuredAnimations`
    );

    if (pageParam) {
      url.searchParams.set("cursor", pageParam);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    return (await response.json()) as FeaturedAnimationsListResponseData;
  };

  const openPlaygroundForData = async (data: Animation) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/v1/playground/create`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    return await response.text();
  };

  const getPlaygroundById = async (id: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/v1/playground/${id}`,
      {
        method: "GET",
      }
    );

    const playground: Playground = await response.json();

    return playground;
  };

  return {
    getFeaturedAnimations,
    openPlaygroundForData,
    getPlaygroundById,
  };
}
