import React from "react";
import Spinner from "../shared-components/spinner";
import * as actionCreators from "../../state/actions";
import { AnyAction, Dispatch } from "redux";
import { useDispatch } from "react-redux";
import AlertDialog, { DialogButtonType } from "../shared-components/dialog";
import { useAppSelector } from "../../state/hook";
import {NextRouter, useRouter } from "next/router";
import { routerPathKey } from "../keys/router-path.key";
// All initialization will be done here
interface IState{
    spinner: boolean;
    title: string;
    description: string;
    open: boolean;

}

interface IProps {
    dispatch: Dispatch<AnyAction>;
    selector: any;
    router: NextRouter;
}
class IntializationInner extends React.Component<IProps, IState> {

    private changeInTab= true;
    constructor(props: IProps) {
        super(props)
        this.state= {
            spinner: true,
            title: '',
            description: '',
            open: false
        }
    }

    componentDidMount() {
        document.addEventListener('contextmenu', event => event.preventDefault());
        let hidden = "hidden";
        const onChange = (event: Event) => {
            if(event && this.changeInTab && this.props.router.pathname === routerPathKey.examination) {
                this.props.dispatch(actionCreators.violationCreators.decrementViolation());
                let violationLeft = this.props.selector.violations - 1;
                violationLeft = violationLeft < 0 ? 0 : violationLeft;
                if(violationLeft > 0) {
                this.setState({open: true,
                    title: 'Violation is captured by the system!',
                    description: `Your examination will be cancelled after <strong class="danger-text">${violationLeft}</strong> violation ${violationLeft <=1 ? 'attempt' :'attempts'}.<br/>
<strong class="danger-text"> Make sure you don't close exam tab or open any other tab.</strong>` });
                }
                this.changeInTab = false;
            }
        }

        // Standards:
        if (hidden in document)
            document.addEventListener("visibilitychange", onChange);
        else if ((hidden = "mozHidden") in document)
            document.addEventListener("mozvisibilitychange", onChange);
        else if ((hidden = "webkitHidden") in document)
            document.addEventListener("webkitvisibilitychange", onChange);
        else if ((hidden = "msHidden") in document)
            document.addEventListener("msvisibilitychange", onChange);
        // IE 9 and lower:
        else if ("onfocusin" in document)
            (document as any).onfocusin = (document as any).onfocusout = onChange;
        // All others:
        else
            window.onpageshow = window.onpagehide
                = window.onfocus = window.onblur = onChange;
    }

    onDialogClose() {
        this.changeInTab = true;
        this.setState({open: false});
    }

    render = () => {
        return <>
            <AlertDialog title={this.state.title} description={this.state.description} handleBack={() => this.onDialogClose()}
                         open={this.state.open} buttons={[{name: 'Ok', type: DialogButtonType.yes}]}/>
             {this.state.spinner ? <Spinner/>: <></> }
        </>;
    }
}
const Intialization = (props: any) => {
    return <IntializationInner router={useRouter()} dispatch={useDispatch()} selector={useAppSelector(state => state.violations)}/>
};

export default Intialization;
