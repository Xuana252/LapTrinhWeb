"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export default function Provider({ children, session }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
