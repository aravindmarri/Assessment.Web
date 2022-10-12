import { Action } from "redux";
import * as showSpinnerAction from "../actions/spinner.action";

interface IState {
    show: boolean;
}
 
const initialState : IState = {
    show: false
}

 const reducer = (state = initialState, action: any) => {
    let returnState = state;
    switch (action.type){
        case showSpinnerAction.showSpinnerType: returnState = { ... state, show: action.payload}; break;
    }
    return returnState;
}

export const getSpinner = (state: IState) => state.show;

export default reducer;
