import Container from "./Container.tsx";

import Logo from "../assets/lottiefiles.svg";
import ToggleDarkMode from "./ToggleDarkMode.tsx";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const style = {
    header:
      "py-4 lg:py-5 border-b border-t-border theme-neutral-light dark:theme-neutral bg-t-bg text-t-text-light",
    container: "flex items-center justify-between",
    logo: "h-5 lg:h-7 text-t-text",
    darkModeButton: "w-4 h-4 lg:w-6 lg:h-6",
  };

  return (
    <header className={style.header}>
      <Container className={style.container}>
        <div className="flex items-center gap-2">
          <img src={Logo} style={{ width: "20px", height: "20px" }}></img>
          <h2 className="font-bold">Lottie Editor</h2>
          {location.pathname !== "/" && (
            <Link className="ml-8 font-semibold text-t-text text-" to="../">
              Home
            </Link>
          )}
        </div>
        <ToggleDarkMode className={style.darkModeButton} />
      </Container>
    </header>
  );
}
