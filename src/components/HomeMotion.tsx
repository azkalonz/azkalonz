import type { ReactNode } from "react";

type HomeMotionProps = {
  children: ReactNode;
};

const HomeMotion = ({ children }: HomeMotionProps) => (
  <div className="relay-home">{children}</div>
);

export default HomeMotion;
