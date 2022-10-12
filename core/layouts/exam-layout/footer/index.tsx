import Button from "@mui/material/Button";
import React from "react";
import  styles from '../../../../styles/examination.module.scss';

interface IProps {
    className: string;
    handleBack: (e: any) => void;
    handleClick: (e: any) => void;
}

export class Footer extends React.Component<IProps , {}> {
    constructor(props: IProps) {
        super(props);

    }


    render = () => {


        return <div className={this.props.className + ' flex flex-row items-center '}>
            <div className={styles.maxWidth340}></div>
            <div className={styles.innerFooter + ' flex justify-between'}>
                 <Button className="primary-button disabled-bg" variant="contained" disableElevation
                    onClick={(e) => this.props.handleBack(e)}   >{'< Back'}</Button>
            <Button className="primary-button dark-bg" variant="contained" disableElevation
                    onClick={(e) => this.props.handleClick(e)}>{'Next >'}</Button>
            </div>
        </div>;
    }
}
