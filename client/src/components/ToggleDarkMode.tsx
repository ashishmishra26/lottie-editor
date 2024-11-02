import { Icon } from "@iconify/react";
import clsx from "clsx";

import { useEffect, useState } from "react";

type ToggleDarkModeProps = {
  className?: string;
};

export default function ToggleDarkMode({ className }: ToggleDarkModeProps) {
  const [dark, setDark] = useState(true);

  const handleToggleDarkMode = () => {
    setDark(!dark);
  };

  useEffect(() => {
    if(dark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [dark]);

  return (
    <button
      type="button"
      onClick={handleToggleDarkMode}
      className={clsx("flex transition-colors hover:text-t-text", className)}
    >
      <Icon
        icon={dark ? "ri:moon-line" : "ri:sun-line"}
        className="w-full h-full"
      />
    </button>
  );
}
