import * as actionCreators from "../state/actions";
import { useAppDispatch } from "../state/hook";

export class AppService {
    dispatch: any;
    constructor() {
        this.dispatch = useAppDispatch();

    }
    showSpinner(show = true) {
        this.dispatch(actionCreators.spinnerCreators.showSpinner(show));
    }
}
