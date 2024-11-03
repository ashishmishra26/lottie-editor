import { Icon } from "@iconify/react";
import clsx from "clsx";
import useDarkMode from "use-dark-mode";

type ToggleDarkModeProps = {
  className?: string;
};

const darkModeConfig = {
  classNameDark: "dark",
  classNameLight: "light",
  element: document.documentElement,
};

export default function ToggleDarkMode({ className }: ToggleDarkModeProps) {
  const darkMode = useDarkMode(false, darkModeConfig);

  return (
    <button
      type="button"
      onClick={darkMode.toggle}
      className={clsx("flex transition-colors hover:text-t-text", className)}
    >
      <Icon
        icon={darkMode.value ? "ri:moon-line" : "ri:sun-line"}
        className="w-full h-full"
      />
    </button>
  );
}
