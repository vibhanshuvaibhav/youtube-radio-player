import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './Reducers/rootReducer'
import App from './App'
import ErrorBoundary from './Components/ErrorBoundary'
import './index.css'

const persistConfig = {
  key: 'root_radio_room_v1',
  storage,
}

let store
try {
  const persistedReducer = persistReducer(persistConfig, rootReducer)
  store = createStore(persistedReducer)
  persistStore(store)
} catch (e) {
  console.warn('Persisted store initialization fallback:', e)
  store = createStore(rootReducer)
}

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>,
  )
}
