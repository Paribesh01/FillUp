import type { ReactNode } from "react";
import FormLayoutShell from "../FormLayoutShell";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FormLayoutShell params={{ id }}>{children}</FormLayoutShell>;
}
