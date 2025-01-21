import { type JSX } from "react";

export function Card({
  className,
  title,
  children,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <a className={className} rel="noopener noreferrer" target="_blank">
      {/* <h2>
        {title} <span>-&gt;</span>
      </h2> */}
      <p>{children}</p>
    </a>
  );
}
