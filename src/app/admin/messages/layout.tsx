import type { ReactNode } from "react";
import SectionGuard from "../section-guard";

export default function Layout({ children }: { children: ReactNode }) {
  return <SectionGuard section="messages">{children}</SectionGuard>;
}
