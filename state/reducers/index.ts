import {combineReducers} from "redux";
import * as spinnerReducer from "./spinner.reducer";
import * as violationReducer from "./violation.reducer";

export interface IReduxState {
    spinner: typeof spinnerReducer.getSpinner;
    violations: typeof violationReducer.getViolations
}


const reducers = combineReducers({
    spinner: spinnerReducer.default,
    violations: violationReducer.default
})
export default reducers;
