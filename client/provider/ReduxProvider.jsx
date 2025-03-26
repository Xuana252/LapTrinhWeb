"use client"; // Ensures this component runs on the client side

import { Provider as ReduxProvider, useSelector } from "react-redux";
import { store, persistor } from "@provider/redux/store";
import { SessionProvider } from "next-auth/react";
import useSyncSession from "./redux/useSyncSession";
import { PersistGate } from "redux-persist/integration/react";
import { usePathname, useRouter } from "@node_modules/next/navigation";

import { useEffect } from "react";

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>
        <SessionSyncWrapper>{children}</SessionSyncWrapper>
      </ReduxProvider>
    </SessionProvider>
  );
}

function SessionSyncWrapper({ children }) {

  useSyncSession();


  return (
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  );
}
