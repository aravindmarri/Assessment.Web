import { AnyAction } from "redux";
import {BaseAction, createAction } from "redux-actions";

export const showSpinnerType = "[SPINNER] SHOW SPINNER";
export interface ActionPayload {
    type: string;
    payload: boolean;
}

export const showSpinner = (payload: boolean) => {
    return {type: showSpinnerType, payload}
}
