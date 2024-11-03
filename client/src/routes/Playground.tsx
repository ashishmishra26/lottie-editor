import { Animation } from "@lottiefiles/lottie-types";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { createContext, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";
import { useShallow } from "zustand/react/shallow";

import LoadingScreen from "../components/LoadingScreen.tsx";
import AnimationPreview from "../components/playground/AnimationPreview.tsx";
import Chat from "../components/playground/Chat.tsx";
import LayerActions from "../components/playground/LayerActions.tsx";
import Layers from "../components/playground/Layers.tsx";
import MultipleLayerActions from "../components/playground/MultipleLayerActions.tsx";
import Settings from "../components/playground/Settings.tsx";
import useAPI from "../hooks/useAPI.tsx";
import useMessagesFromSocket from "../hooks/useMessagesFromSocket.tsx";
import useUpdatesFromSocket from "../hooks/useUpdatesFromSocket.tsx";
import usePlaygroundStore from "../stores/playgroundStore.ts";
import { SocketMessage } from "../types/types.ts";
import Header from "../components/Header.tsx";
import Container from "../components/Container.tsx";

export const socketContext = createContext<null | WebSocketHook<SocketMessage>>(
  null
);

export default function PlaygroundLoader() {
  const { playgroundId } = useParams();
  const { getPlaygroundById } = useAPI();
  const {
    setPlaygroundId,
    setJSON,
    setMessages,
    setInitialJSON,
    json,
    clearSelectedLayers,
  } = usePlaygroundStore(
    useShallow(
      ({
        json,
        setPlaygroundId,
        setJSON,
        setMessages,
        setInitialJSON,
        clearSelectedLayers,
      }) => ({
        json,
        setPlaygroundId,
        setJSON,
        setMessages,
        setInitialJSON,
        clearSelectedLayers,
      })
    )
  );

  const { data, isFetched, error } = useQuery({
    queryKey: [playgroundId],
    queryFn: () => (playgroundId ? getPlaygroundById(playgroundId) : undefined),
    retry: false,
  });

  const socket = useWebSocket<SocketMessage>(
    `http://localhost:3006/api/v1/playground/${playgroundId}/ws`
  );

  useEffect(() => {
    const parsedJson = data?.json ? (JSON.parse(data.json) as Animation) : null;
    setJSON(parsedJson);
    setInitialJSON(parsedJson);
    setPlaygroundId(data?.id ?? "");
    setMessages(data?.Message ?? []);
    clearSelectedLayers();
  }, [data]);

  if (!playgroundId) {
    return null;
  }

  if (!isFetched) {
    return <LoadingScreen />;
  }

  if (!data || error) {
    return null;
  }

  if (!json) {
    return <LoadingScreen />;
  }

  return (
    <socketContext.Provider value={socket}>
      <Playground />
    </socketContext.Provider>
  );
}

export function Playground() {
  const { readyState } = useContext(socketContext)!;

  useMessagesFromSocket();
  useUpdatesFromSocket();

  const { json, selectedLayers } = usePlaygroundStore(
    useShallow(({ json, selectedLayers }) => ({
      json,
      selectedLayers,
    }))
  );

  const style = {
    layout:
      "overflow-hidden flex flex-col lg:h-screen lg:grid lg:grid-cols-[18rem,1fr]",
    col: "flex flex-col px-3 lg:p-3 lg:pl-0 last:mt-3 lg:last:mt-0 last:pb-3 gap-3 flex-1 overflow-hidden",
    card: "flex flex-col bg-t-bg text-t-text-light border border-t-border rounded-md overflow-auto relative shadow-sm",
    cardTitle:
      "text-t-text text-base border-b bg-t-bg border-t-border px-3 py-2 heading sticky top-0 bg z-[1]",
    cardContent: "p-3 w-full",
    animationCol: "order-[-1] h-[100vw] lg:order-none lg:h-auto p-4",
    layersCard: "bg-t-bg max-h-[15rem] lg:max-h-none flex-1",
    layersCardHeader: "flex items-center justify-between gap-3",
    layersCardHelper:
      "hidden lg:block text-xs p-3 border-b border-t-border text-t-text-light font-normal",
    layers: "py-1",
    noLayersText: "text-t-text-light p-3 text-sm",
    discussionCard: "absolute h-[24rem] lg:h-auto lg:flex-grow",
    settingsCard: "shrink-0",
    multipleLayerActionsCard: "shrink-0 max-h-[50vh] overflow-auto",
    selectedLayerActionsCard: "shrink-0 lg:max-h-[40vh] overflow-auto",
    offlineCard: "shrink-0 !theme-error !border-0",
    offlineTitle: "text-base heading text-t-text font-semibold",
    offlineText: "text-sm mt-1",
    offlineButton: "mt-3",
    backLink:
      "flex items-center gap-1.5 mt-2.5 transition-colors hover:text-t-text",
    backIcon: "w-4 h-4",
  };

  return (
    <>
      <Header />
      <Container>
        <div className={style.layout}>
          <div className={style.col}>
            {readyState === ReadyState.CLOSED && (
              <div className={clsx(style.card, style.offlineCard)}>
                <div className={style.cardContent}>
                  <div className={style.offlineTitle}>You are offline</div>
                  <div className={style.offlineText}>
                    Connection has been closed. Please refresh your page.
                  </div>
                  <button
                    onClick={() => location.reload()}
                    className={style.offlineButton}
                  >
                    Refresh
                  </button>
                </div>
              </div>
            )}

            <div className={clsx(style.card, style.settingsCard)}>
              <div className={style.cardContent}>
                <Settings />
              </div>
            </div>

            {selectedLayers.length === 1 && (
              <LayerActions layerKey={selectedLayers[0]} />
            )}

            {selectedLayers.length > 1 && (
              <MultipleLayerActions count={selectedLayers.length} />
            )}

            <div className={clsx(style.card, style.layersCard)}>
              <div className={style.cardTitle}>
                <div className={style.layersCardHeader}>
                  <div>Layers</div>
                </div>
              </div>
              <div className={style.layersCardHelper}>
                Shift + Click for multi-select
              </div>
              {json?.layers?.length ? (
                <Layers
                  layers={json.layers}
                  path="layers"
                  className={style.layers}
                />
              ) : (
                <div className={style.noLayersText}>No layers found.</div>
              )}
            </div>
          </div>

          <div className={style.animationCol}>
            <AnimationPreview />
          </div>

          <Chat />
        </div>
      </Container>
    </>
  );
}
