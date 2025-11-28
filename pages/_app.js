
import '../styles/globals.css';
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1976d2" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
