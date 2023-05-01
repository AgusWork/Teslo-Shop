import "@/styles/globals.css";
import { lightTheme } from "@/themes";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { AuthProvider, CartProvider, UIProvider } from "../context";
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_ID || ""}}>
        <SWRConfig
          value={{
            // refreshInterval: 30000,
            fetcher: (resource, init) =>
              fetch(resource, init).then((res) => res.json()),
          }}
        >
          <AuthProvider>
            <CartProvider>
              <UIProvider>
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline />
                  <Component {...pageProps} />
                </ThemeProvider>
              </UIProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  );
}
