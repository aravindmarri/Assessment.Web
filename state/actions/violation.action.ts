import { AnyAction } from "redux";
import {BaseAction, createAction } from "redux-actions";

export const decrementViolationType = "[VIOLATION] DECREMENT VIOLATION";
export interface ActionPayload {
    type: string;
    payload: boolean;
}

export const decrementViolation = () => {
    return {type: decrementViolationType}
}
