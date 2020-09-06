import Header from '../components/Header'
import Footer from '../components/Footer'
import Head from 'next/head'

/**
 * [Container component that contains the general structure of the page]
 *
 * @param   {[Object]}  props  [props]
 *
 * @return  {[Component]}       [return component]
 */
export default function Layout({ children }) {
  return (
    <div className='container'>
      <Head>
        <title>Edgewater Markets</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Header />
      <main className='mt-5 p-2'>{children}</main>
      <Footer />
    </div>
  )
}
