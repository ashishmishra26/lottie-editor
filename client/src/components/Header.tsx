import Container from "./Container.tsx";

export default function Header() {
  const style = {
    header:
      "py-4 lg:py-5 border-b border theme-neutral-light dark:theme-neutral bg text-t-text-light",
    container: "flex items-center justify-between",
    logo: "h-5 lg:h-7 text-t-text",
    darkModeButton: "w-4 h-4 lg:w-6 lg:h-6",
  };

  return (
    <header className={style.header}>
      <Container className={style.container}>Lottie Editor</Container>
    </header>
  );
}
