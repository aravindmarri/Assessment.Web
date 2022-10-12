import {Action, applyMiddleware, createStore} from "redux";
import reducers from "./reducers";
import thunk, { ThunkAction } from "redux-thunk";

export const store = createStore(reducers, {}, applyMiddleware(thunk))
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
    >;
