import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const MainPage = lazy(() => import("../routes/MainPage.tsx"));
const PlaygroundLoader = lazy(() => import("../routes/Playground.tsx"));
const Root = lazy(() => import("../routes/Root.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/:playgroundId",
        element: <PlaygroundLoader />,
      },
    ],
  },
]);

export default router;
