// store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore,persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import counterReducer from './counterSlice'
// ...

export const rootReducer = combineReducers({
  counter: counterReducer
})
const persistConfig = {
  key: 'root',
  storage ,
  blacklist:[]
}
const myPersistReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
  reducer: myPersistReducer,
  middleware: (getDefaultMiddleware: Function) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})

export const persistor = persistStore(store)
