import Head from 'next/head';

const Layout = ({ children }) => (
  <div className="container">
    <Head>
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
    `}
      </style>
    </Head>
    {children}
  </div>
);

export default Layout;
