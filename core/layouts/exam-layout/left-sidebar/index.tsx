import Button from "@mui/material/Button";
import React from "react";
import  styles from '../../../../styles/examination.module.scss';
import {IAnswerData, IQuestions } from "../../../models/question.model";
interface IProps {
    className: string;
    handleSidebarButton:any;
    questions: IQuestions[];
    currentIndex:number;
    answeredData: IAnswerData[];

}
export class LeftSidebar extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
    }
    render = () => {
        return <div className={this.props.className + ' flex ' + styles.sideBarOuterDiv}>
            <div className={styles.sideBarInnerDiv + ' rounded-3xl flex flex-col justify-start'}>
                <span className="text-lg font-bold">Questions</span>
                <div className="overflow-auto">
                <div className="flex flex-row flex-wrap mt-4">
                    {
                    this.props.questions.map((e, i) => {

                        return <Button key={i + 1} className={( i !== this.props.currentIndex  ? styles.inActiveButton : 'dark-bg') +
                            ' primary-button dark-bg max-width-q-btn ' + ( !!this.props.answeredData.find(x => x.questionId === e.id && x.optionId !== -1)  ? styles.answeredButton : '')}
                                    variant="contained" disableElevation
                                      onClick={(e) => this.props.handleSidebarButton(i)} >{i + 1} </Button>
                    })
                }
                </div>
                </div>
            </div>
        </div>;
    }
}
