import ReactDOM from 'react-dom/client';
import React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from './themes/theme';
import Router from './Router';

import { SWRConfig } from 'swr';

import reportWebVitals from './reportWebVitals';
import * as Sentry from '@sentry/react';

const DEBUG = process.env.NODE_ENV === 'development';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;

if (!DEBUG && SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ['localhost', SERVER_URL],
      }),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 0.3,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 0.7,
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <SWRConfig
        value={
          {
            // refreshInterval: 5000,
            // fetcher: ,
          }
        }
      >
        <Router />
      </SWRConfig>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
