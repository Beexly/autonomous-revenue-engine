import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PhoneProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Phone({ children, className, style }: PhoneProps) {
  return (
    <div className={cn("phone-shell", className)} style={style}>
      <div className="phone-notch" />
      <div className="phone-screen">{children}</div>
    </div>
  );
}
