import { CacheProvider, EmotionCache } from "@emotion/react";
import type { AppProps } from "next/app";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";

import { ThemeProvider } from "@mui/material/styles";
import { wrapper, store } from "../app/store";

import createEmotionCache from "../shared/createEmotionCache";
import theme from "../shared/theme";
import setup from "../shared/infra/services/setupInterceptor";

setup(store);

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default wrapper.withRedux(MyApp);
