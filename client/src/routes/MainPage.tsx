import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useCallback, Fragment } from "react";
import Container from "../components/Container";
import Header from "../components/Header";
import useAPI from "../hooks/useAPI";
import Upload from "../components/Upload";
import Card from "../components/Card";
import { Icon } from "@iconify/react";

export default function MainPage() {
  const { getFeaturedAnimations } = useAPI();

  const { data, fetchNextPage, isFetchingNextPage, isFetched, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["featuredAnimations"],
      queryFn: getFeaturedAnimations,
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const style = {
    container: "min-h-screen pt-6 lg:pt-10 pb-16 lg:pb-24 flex flex-col",
    upload: "w-full lg:w-full flex-grow overflow-hidden", // Ensure full width and no scrolling
    featured: "lg:w-full flex-grow",
    title: "heading text-2xl lg:text-4xl font-bold text-t-text",
    grid: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6 mt-4 lg:mt-6",
    error:
      "rounded-2xl col-span-2 md:col-span-3 lg:col-span-4 p-6 text-center text-base border border-t-border",
  };

  return (
    <>
      <Header />
      <Container className={style.container}>
        <div className={style.upload}>
          <Upload />
        </div>
        <div className={style.featured}>
          <div className={style.grid}>
            {!isFetched &&
              Array(12)
                .fill(null)
                .map((_, i) => <Card animation={null} key={i} />)}
            {isFetched &&
              (data ? (
                data?.pages.map((page, pageIndex) => (
                  <Fragment key={pageIndex}>
                    {page.animations.map((animation) => (
                      <Card key={animation.id} animation={animation} />
                    ))}
                  </Fragment>
                ))
              ) : (
                <div className={style.error}>
                  Failed to fetch featured animations, please try again.
                </div>
              ))}
          </div>
          {isFetchingNextPage && (
            <Icon icon="ri:loading-line" />
          )}
          {/* Div to trigger fetching more items when it comes into view */}
          <div ref={loadMoreRef} className="h-10"></div>
        </div>
      </Container>
    </>
  );
}
