import {useEffect, useState } from "react";
import * as actionCreators from "../../../state/actions";
import {useAppDispatch, useAppSelector } from "../../../state/hook";
import { IReduxState } from "../../../state/reducers";
import { getSpinner } from "../../../state/reducers/spinner.reducer";



const Spinner = () => {
    const [showSpinner, setSpinner] = useState(false);
    const spinner: any = useAppSelector(state => state.spinner);
    useEffect(() => {
        setSpinner(spinner.show);
    });

    return showSpinner ? <div className="spinner-outer fixed inset-0 h-screen	w-screen flex justify-center items-center">
    <img className="spinner-img" src="/images/spin.svg" alt="Spinner"/>
    </div>: <></>;
}

export default Spinner;
