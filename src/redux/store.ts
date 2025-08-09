
import { configureStore } from "@reduxjs/toolkit"
import { homeReducer } from "./slices"
export const store = configureStore({
    reducer: {
        homeReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
