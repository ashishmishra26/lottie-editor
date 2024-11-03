import clsx from "clsx";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { ReadyState } from "react-use-websocket";
import { useShallow } from "zustand/react/shallow";
import { Icon } from "@iconify/react";

import { socketContext } from "../../routes/Playground.tsx";
import usePlaygroundStore from "../../stores/playgroundStore.ts";

const Chat = () => {
  const socket = useContext(socketContext)!;
  const messages = usePlaygroundStore(useShallow(({ messages }) => messages));
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesContainer = useRef<HTMLDivElement | null>(null);

  const { sendMessage: socketSendMessage, readyState: socketReadyState } =
    socket || {};

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = { type: "message", username, text: input };
    socketSendMessage?.(JSON.stringify(message));
    setInput("");
  };

  useEffect(() => {
    if (messagesContainer.current) {
      messagesContainer.current.scrollTop =
        messagesContainer.current.scrollHeight;
    }
  }, [messages]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Connected",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[socketReadyState || ReadyState.CLOSED];

  const themeByStatus = {
    [ReadyState.CONNECTING]: "bg-blue-500 text-white",
    [ReadyState.OPEN]: "theme-success bg-t-bg text-t-text",
    [ReadyState.CLOSING]: "theme-error bg-t-bg text-t-text",
    [ReadyState.CLOSED]: "theme-error bg-t-bg text-t-text",
    [ReadyState.UNINSTANTIATED]: "bg-gray-500 text-white",
  }[socketReadyState || ReadyState.CLOSED];

  const style = {
    container: "fixed bottom-5 bg-t-bg right-10 z-50",
    floatingButton:
      "text-t-text font-bold border border-t-border p-4 flex justify-center rounded-md cursor-pointer shadow-md bg-t-bg",
    chatBox:
      "shadow-lg rounded-lg overflow-hidden transition-all duration-300 flex flex-col w-80 h-[70vh]",
    header:
      "flex justify-between items-center text-t-text text-base p-3 border-b border-b-border",
    form: "p-3 flex-col border-t border-t-border gap-y-2.5",
    messages: "flex-grow overflow-y-auto p-3 gap-3",
    messagesWrapper: "w-full flex flex-col items-start gap-3",
    message:
      "theme-neutral-light-tint dark:theme-neutral-tint bg-t-bg text-t-text-light border border-t-border rounded-xl px-2.5 py-1.5",
    input:
      "flex-1 h-10 mb-3 w-full appearance-none min-w-0 border border-t-border text-t-text placeholder-t-text-light rounded-xl text-sm px-3",
    messageAuthor: "text-sm leading-normal",
    messageText: "text-t-text text-base leading-normal",
  };

  return (
    <div className={style.container}>
      {!isOpen ? (
        <div onClick={() => setIsOpen(true)} className={style.floatingButton}>
          Chat
        </div>
      ) : (
        <div className={clsx(style.chatBox)}>
          <div className={style.header}>
            <span className="font-bold">Chat</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            >
              <Icon icon="ri:close-line" className="w-full h-full" />
            </button>
          </div>

          <div className={style.messages} ref={messagesContainer}>
            <div className={style.messagesWrapper}>
              <div className="sticky top-0 w-full flex justify-center">
                <div
                  className={clsx(
                    themeByStatus,
                    "px-2.5 rounded-full text-sm font-bold"
                  )}
                >
                  {connectionStatus}
                </div>
              </div>

              {messages.length
                ? messages.map((msg, n) => (
                    <div className={style.message} key={n}>
                      <div className={style.messageAuthor}>{msg.username}</div>
                      <div className={style.messageText}>{msg.text}</div>
                    </div>
                  ))
                : null}
            </div>
          </div>

          <form onSubmit={sendMessage} className={style.form}>
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setUsername(e.target.value)}
              className={style.input}
              required
              name="name"
              minLength={2}
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={style.input}
              placeholder="Message..."
              name="messag"
              required
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-t-text font-bold w-full py-2 px-4 rounded-xl"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;
