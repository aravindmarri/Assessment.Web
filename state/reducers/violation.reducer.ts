import { Action } from "redux";
import { gaKey } from "../../core/keys/ga.key";
import * as violationAction from "../actions/violation.action";

interface IState {
    violations: number;
}

const initialState : IState = {
    violations: gaKey.totalAllowedViolations
}

const reducer = (state = initialState, action: any) => {
    let returnState = state;
    switch (action.type) {
        case violationAction.decrementViolationType:
            const violations = state.violations - 1;
            returnState = {...state, violations: violations < 0 ? 0 : violations};
            break;
            }
            return returnState;
}
export const getViolations = (state: IState) => state.violations;

export default reducer;

