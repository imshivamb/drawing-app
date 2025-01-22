import { type JSX } from "react";

interface CardProps {
  className?: string;
  title: string;
  children: React.ReactNode;
}

export function Card({ className, title, children }: CardProps): JSX.Element {
  return (
    <div className={`${className} shadow-sm rounded-lg`}>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
