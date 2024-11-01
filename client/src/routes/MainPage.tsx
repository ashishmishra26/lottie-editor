import { useInfiniteQuery } from "@tanstack/react-query";

import Container from "../components/Container";
import Header from "../components/Header";
import useAPI from "../hooks/useAPI";
import Upload from "../components/Upload";
import Card from "../components/Card";
import { Fragment } from "react/jsx-runtime";

export default function MainPage() {
  const { getFeaturedAnimations } = useAPI();

  const { data, fetchNextPage, isFetchingNextPage, isFetched } =
    useInfiniteQuery({
      queryKey: ["featuredAnimations"],
      queryFn: getFeaturedAnimations,
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const style = {
    container: "pt-6 lg:pt-10 pb-16 lg:pb-24",
    title: "heading text-2xl lg:text-4xl font-bold text-t-text",
    featured: "mt-10 lg:mt-16",
    grid: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6 mt-4 lg:mt-6",
    sorry:
      "rounded-2xl col-span-2 md:col-span-3 lg:col-span-4 p-6 text-center text-base border border-t-border",
    buttonWrapper: "flex justify-center mt-8 lg:mt-12",
    uploadButton: "rounded-2xl theme-brand-tint hover:theme-brand",
  };

  return (
    <>
      <Header />
      <Container className={style.container}>
        <Upload />
        <div className={style.featured}>
          <h1 className={style.title}>Featured animations</h1>
          <div className={style.grid}>
            {/* Loading */}
            {!isFetched &&
              Array(12)
                .fill(null)
                .map((_n, i) => <Card animation={null} key={i} />)}

            {/* Loading finished */}
            {isFetched &&
              (data ? (
                data?.pages.map((page, index) => (
                  <Fragment key={index}>
                    {page.animations.map((animation) => (
                      <Card key={animation.id} animation={animation} />
                    ))}
                  </Fragment>
                ))
              ) : (
                <div className={style.sorry}>
                  Sorry, we couldn&apos;t fetch featured animations.
                </div>
              ))}
          </div>

          {/* Show more */}
          {!!data && (
            <div className={style.buttonWrapper}>
              <button
                className="rounded-xl theme-brand-tint hover:theme-brand"
                onClick={fetchNextPage}
              >
                {isFetchingNextPage ? "Loading..." : "Show more"}
              </button>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
