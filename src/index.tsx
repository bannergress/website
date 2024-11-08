import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App'
import { store, persistor } from './store'

import './index.scss'
import './assets/style/_mobile.scss'

import '@fontsource/roboto/400.css'
import '@fontsource/roboto/400-italic.css'
import '@fontsource/roboto/700.css'

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)
