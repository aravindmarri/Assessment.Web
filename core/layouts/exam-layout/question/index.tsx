import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";
import  styles from '../../../../styles/examination.module.scss';
import { gaKey } from "../../../keys/ga.key";
import { IQuestions } from "../../../models/question.model";

interface IProps {
questions: IQuestions;
categoryId: string;
sendAnswer: (e: number) => void;
currentAnswer: number;
currentIndex: number;
}

interface IState {
    description: string;
    code: string;
    currentValue: number;
}
export class Question extends React.Component<IProps,IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            description: '', code: '', currentValue: -1
        }
    }
    handleChange(event: string): void {
        const currentValue = isNaN(Number(event)) ? -1 : Number(event);
        this.setState({currentValue})
        this.props.sendAnswer(currentValue);
    }
    static getDerivedStateFromProps(props: IProps, state: IState) {
        let description = props.questions?.description || '';
       let code = '';
       if (props.categoryId === 'Code' && description.includes(gaKey.codeSeparator)) {
           const splits = description.split(gaKey.codeSeparator);
           if (splits.length === 3) {
               description = splits[0];
               code = splits[1];
           }
       }
        return {description, code, currentValue: props.currentAnswer === -1 ? state.currentValue : [props.currentAnswer]}
    }


    render = () => {

        const { questions }= this.props;
        return <div className={styles.questionOuter + ' flex'}>
            <div className={styles.questionInner + ' flex rounded-3xl'}>
                <div className={styles.questionDeepInner + ' rounded-3xl'}>
                    <div className={styles.QuestionHeading + ' whitespace-pre-wrap'} >
                        {this.props.currentIndex + 1}. {this.state.description}
                    </div>
                    <div className="overflow-y-auto question-scrollbar">
                    {this.state.code.length > 0 ? <div className="whitespace-pre bg-slate-200 p-1 rounded-lg">{this.state.code}</div>: ''}
                    <div className={styles.AnswerHeading}>

                        <FormControl>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                onChange={(e) => this.handleChange(e.target.defaultValue)}
                                value={this.state.currentValue}
                            >
                                {
                                    questions?.option?.map((e, i) => {
                                        return (<FormControlLabel key={i + 1} value={e.optionId} control={<Radio className="w-auto" />} label={e.description} />)
                                    })
                                }
                            </RadioGroup>
                        </FormControl>
                    </div>
                    </div>

                </div>

            </div>
        </div>;
    }
}
