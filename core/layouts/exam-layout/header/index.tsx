import Button from "@mui/material/Button";
import React from "react";
import  styles from '../../../../styles/examination.module.scss';
import Permissions from '../../../components/Permissions'
import TimerIcon from '@mui/icons-material/Timer';
import AlertDialog, { DialogButtonType } from "../../../shared-components/dialog";
import { routerPathKey } from "../../../keys/router-path.key";
interface IProps {
    className: string;
    categories: string[];
    currentCategoryIndex: number;
    outputCurrentIndex: (e: number) => void;
    finalSubmit: (e: boolean) => void;
    finalSubmitOnTimeOut: () => void;
    sendImageList: (e: string[]) => void;
}
interface IState {
remainigTime: string;
title:string;
    subtitle:string;
    open:boolean;
}
export class Header extends React.Component<IProps,IState> {

    private readonly duration = 20; // in minutes
    private finalTime = 0;
    constructor(props: IProps) {
        super(props);
        this.state = {
            remainigTime: this.getFormattedTime(0),
            title: 'Timeout!',
            subtitle: 'Your examination is completed',
            open: false,
        }
    }
    getFormattedTime = (m: number) => {
        const h = Math.floor(m / 60);
        m = m % 60;
        return `${h}h ${m <= 0 ? '00' : m.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })}m`;
    }

    componentDidMount = () => {
        const timerCode = () => {
            const availableTime = Math.ceil((this.finalTime - Date.now()) / minute); // in minutes
            this.setState({remainigTime: this.getFormattedTime(availableTime < 0 ? 0 : availableTime)});
            if (availableTime <= 0) {
                clearInterval(timer);
                this.togglePopup(true)

            }
        }
        const minute = 60 * 1000;
        this.finalTime = Date.now() + this.duration * minute;
        timerCode();
        const timer = setInterval(() => {
            timerCode();
        }, minute);
    }
    handleBackButton = (e:any) => {
        this.setState({open: false});

    }
    togglePopup = (isFinished = false) => {
        this.setState(prevState => ({ open: !prevState.open }));
        if(isFinished){
            this.props.finalSubmitOnTimeOut()
        }
    }

    render = () => {
        return <div className={this.props.className + ' ' + styles.headerOuter + ' flex justify-between items-center'} >
            <Permissions submitExamOnCancel={() => this.props.finalSubmit(true)} sendImageList={(e: string[]) => this.props.sendImageList(e)}/>

            <AlertDialog title={this.state.title} description={this.state.subtitle} handleBack={this.handleBackButton.bind(this)}
                         open={this.state.open} buttons={[{name: 'Ok', type: DialogButtonType.yes}]}
                          />

        <div className={this.props.className + ' flex justify-center items-center'} >
            {
                this.props?.categories?.map((category, i) => {
                    return <>
                        <Button onClick={() => this.props.outputCurrentIndex(i)} className={'primary-button ' + ( i <= this.props.currentCategoryIndex ? 'dark-bg' : 'light-bg')} variant="contained" disableElevation>{category}</Button>
                        {i < this.props.categories.length - 1 ? <div className={styles.stepperBar + ' ' + ( i < this.props.currentCategoryIndex ? 'dark-bg' : 'light-bg')}></div> : ''}
                    </>
                })
            }

        </div>
            <div className={styles.timer + ' flex flex-row'}>
                <TimerIcon className={'material-icons-outlined ' + styles.matTimerIcon}/>
                {this.state.remainigTime}</div>
            <Button onClick={() => this.props.finalSubmit(false)} className={'primary-button danger-bg '+ styles.submitButton} variant="contained" disableElevation>Submit</Button>

        </div>;
    }
}
