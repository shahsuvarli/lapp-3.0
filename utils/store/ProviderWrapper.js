"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";

function ProviderWrapper({ children, session }) {
  return (
    <Provider store={store}>
      <SnackbarProvider>
        <SessionProvider maxSnack={3} preventDuplicate>
          {children}
        </SessionProvider>
      </SnackbarProvider>
    </Provider>
  );
}

export default ProviderWrapper;
