import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { devToolsEnhancer } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { BannerReducer } from './features/banner'
import { BannerState } from './features/banner/types'

/* Create root reducer, containing all features of the application */
const rootReducer = combineReducers({
  banner: BannerReducer,
})

const store = createStore(
  rootReducer,
  {},
  compose(applyMiddleware(thunk), devToolsEnhancer({}))
)

export interface RootState {
  banner: BannerState
}

export default store
