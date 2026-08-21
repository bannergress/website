import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/es/storage/session'

import { BannerReducer } from './features/banner'
import { PlaceReducer } from './features/place'
import { MissionReducer } from './features/mission'
import { SettingsReducer } from './features/settings/reducer'

const persistConfig = {
  key: 'root',
  storage: storageSession,
  blacklist: ['banner', 'mission'],
}

/* Create root reducer, containing all features of the application */
const rootReducer = combineReducers({
  banner: BannerReducer,
  place: PlaceReducer,
  mission: MissionReducer,
  settings: SettingsReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
})
export const persistor = persistStore(store)
