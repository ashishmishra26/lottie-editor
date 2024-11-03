import clsx from "clsx";
import { ReactNode } from "react";

interface ContainerProps {
  className?: string;
  children?: ReactNode;
}

export default function Container({ className, children }: ContainerProps) {
  const styles = ["px-5 lg:px-10 mx-auto max-w-9xl"];

  return <div className={clsx(styles, className)}>{children}</div>;
}
