//import { inter } from './fonts';
import ClientLayout from './layout.client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
export const metadata = {
  title: 'TWOcvfan',
  description: 'Noget om TWOcvfan',
}

export default function RootLayout({ children }) {

  return (
    <html lang="da">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="TWOcvfan" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ClientLayout navn={metadata.title}>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
