import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
      <script
            src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
            async
          ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
