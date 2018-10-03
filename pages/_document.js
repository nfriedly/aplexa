// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file
// https://nextjs.org/docs/#custom-document

import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <title>Aplexa - Now Playing on Alexa&apos;s Plex Skill</title>

          <link
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
            crossOrigin="anonymous"
          />
          <style>
            {`
body {
  background-color: #000;
  color: #eee;
}
* {
  max-width: 100%;
}
    `}
          </style>
        </head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
