import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '../state/store'
import Intialization from '../core/intialization'

function MyApp({ Component, pageProps }: AppProps) {
    return <>
        {/*All initialization will be done inside Intialization component*/}
        <Provider store={store}>
            <Intialization/>
            <Component {...pageProps} />
        </Provider>
    </>
}


export default MyApp
