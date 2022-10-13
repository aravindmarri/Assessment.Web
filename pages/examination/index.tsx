import React from 'react';
import { Header } from '../../core/layouts/exam-layout/header';
import { LeftSidebar } from '../../core/layouts/exam-layout/left-sidebar';
import { Question } from '../../core/layouts/exam-layout/question';
import { Footer } from '../../core/layouts/exam-layout/footer';
import  styles from '../../styles/examination.module.scss';
import { storageKey } from '../../core/keys/storage.key';
import {IAnswerData, IQuestionCategory, IQuestions, QType, QuestionAnswerView, SubmitExamPayload } from '../../core/models/question.model';
import AlertDialog, { DialogButton, DialogButtonType } from '../../core/shared-components/dialog';
import { AppService } from '../../services/app.service';
import { PersonalInformationService } from '../../services/personal-information.service';
import {NextRouter, useRouter } from 'next/router';
import { routerPathKey } from '../../core/keys/router-path.key';

interface ITask {
    id:number;
    question:string;
    answers:string[];
}


interface IState{
    currentCategoryIndex:number;
    currentQuestionIndex:number;
    count:number;
    quizData: IQuestionCategory[]
    size?:any;
    clicked:boolean;
    answersData: IAnswerData[];
    open: boolean;
    title: string;
    description: string;
    dialogButtons: DialogButton[];
    isCancelled: boolean;
    imageList: string[];
    pageChangeTimer: number;
}
interface IProps {
    app: AppService;
    router: NextRouter;
}

class Examination extends React.Component<IProps,IState> {
    

    private readonly questionService = new PersonalInformationService();
    private examineeDetails: string | null = null

    constructor(props: IProps) {
        super(props);
        this.state = {
            quizData: [],
            currentCategoryIndex: 0,
            currentQuestionIndex: 0,
            count:0,
            size:'',
            clicked: false,
            answersData: [],
            open: false,
            title: '',
            description: '',
            dialogButtons: [],
            isCancelled: false,
            imageList: [],
            pageChangeTimer: 0
        }
      
    }
    navigateToDenied = () => {
        this.props.router.push(routerPathKey.denied);
    }

    setSidebarState(event: number) {
        this.setState({currentQuestionIndex: event, pageChangeTimer: Date.now()});
    }
    componentDidMount = () => {
        this.examineeDetails = localStorage.getItem(storageKey.examineeDetails);

        window.addEventListener('beforeunload', (event) => {
            event.returnValue = 'Are you sure you want to leave?';
        });

        if(!this.examineeDetails) {
            this.navigateToDenied();
        }
        const questions = localStorage.getItem(storageKey.questions);
        if (questions) {
            const quizData: IQuestionCategory[] =  JSON.parse(questions);
            let answersData: IAnswerData[] = [];
            quizData.forEach(e => {
                answersData = answersData.concat(e.questions.map(e => {
                    return {questionId: e.id, optionId: -1} as IAnswerData;
                }))
            })
            this.setState({quizData, answersData});
        } else {
            this.navigateToDenied();
        }
    }

    handleChange= (e:any) => {
        this.setState({
            size: e.target.value
        });

    }
    handleUpdate = () => {
        const nextQuestion = this.state.currentQuestionIndex + 1;
            if(this.state.quizData.length > 0 && this.state.currentCategoryIndex < this.state.quizData.length - 1 ||
                (this.state.currentCategoryIndex === this.state.quizData.length - 1 &&
                    this.state.currentQuestionIndex < this.state.quizData[this.state.currentCategoryIndex].questions.length - 1)) {
            if(this.state.quizData.length > 0 && nextQuestion < this.state.quizData[this.state.currentCategoryIndex].questions.length) {
                this.setState({currentQuestionIndex: nextQuestion, pageChangeTimer: Date.now()})
            } else {
                this.setState({currentCategoryIndex: this.state.currentCategoryIndex + 1, currentQuestionIndex: 0, pageChangeTimer: Date.now()});
            }
        } else {
                this.finalSubmit(false);
        }
    }
    handleBackButton = (e:any) => {
        const prevQuestion = this.state.currentQuestionIndex - 1;
        if(this.state.quizData.length > 0 && this.state.currentCategoryIndex > 0 || (this.state.currentCategoryIndex - 1 === -1 && this.state.currentQuestionIndex > 0)) {
            if(this.state.quizData.length > 0 && prevQuestion >= 0) {
                this.setState({currentQuestionIndex: prevQuestion,pageChangeTimer: Date.now()})
            } else {
                this.setState({currentCategoryIndex: this.state.currentCategoryIndex - 1, pageChangeTimer: Date.now(),
                    currentQuestionIndex: this.state.quizData[this.state.currentCategoryIndex].questions.length - 1});
            }
        }
    }

    setOptionAnswer(e: number): void {
        if(e !== -1) {
            const answersData = this.state.answersData;
            const index = answersData.findIndex(e => e.questionId === this.getCurrentQuestion()?.id);
            if(index > -1) {
                answersData[index].optionId = e;
            }
        }
    }

    getCurrentQuestion = () => this.state.quizData[this.state.currentCategoryIndex].questions[this.state.currentQuestionIndex]

    finalSubmit(isCancelled: boolean) {
        if(isCancelled) {
            const dialogButtons: DialogButton[] = [];
            dialogButtons.push({name: 'Ok', type: DialogButtonType.yes});
            this.setState({open: true, title: '<span class="danger-text">You have attempted maximum number of violations.</span>', description: 'Your examination will be submitted.', dialogButtons, isCancelled})
                this.setState({isCancelled})
        }else {
        const dialogButtons: DialogButton[] = [];
        dialogButtons.push({name: 'Yes', type: DialogButtonType.yes});
        dialogButtons.push({name: 'No', type: DialogButtonType.no});
        this.setState({open: true, title: 'Are you sure you want to submit?', description: 'You will not be able to change your responses further.', dialogButtons, isCancelled})
    }
    }

    onDialogClose(e: number) {
        this.setState({open: false});
        if(e === DialogButtonType.yes) {
            this.submitAnswers();
        }
        if(this.state.isCancelled) {
            this.submitAnswers();
        }
    }

    submitAnswers() {
        const payload = {} as SubmitExamPayload;
        if(this.examineeDetails) {
            const examineeDetails = JSON.parse(this.examineeDetails);
            payload.LinkCode = examineeDetails.linkCode;
            payload.Images = this.state.imageList;
            payload.QuestionAnswerViews = new Array<QuestionAnswerView>();
            this.state.answersData.forEach(e => {
                const entry = {} as QuestionAnswerView;
                entry.QuestionId = e.questionId;
                entry.AnswerId = e.optionId == -1 ? 0 : e.optionId;
                // TODO For now just qustion type of single answer is implemented.
                // Later on multiple answer and text answer will be done.
                // Then we need to send answer text for question type text
                entry.AnswerText = '';
                entry.QTypeId = QType.Single;
                payload.QuestionAnswerViews.push(entry);
            })
            this.props.app.showSpinner();
            this.questionService.submitExam(payload).then(res => {
                this.props.app.showSpinner(false);
                if (res.data) {
                    this.props.router.push(routerPathKey.successful);
                    localStorage.clear();
                }
            }).catch(err => {
                this.props.app.showSpinner(false);
            })
        } else {
            this.navigateToDenied();
        }
    }
    saveImageList(imageList: string[]): void {
        this.setState({imageList})
    }
    render = () => {

        return (

            <div className="min-h-screen flex flex-col">
                <AlertDialog title={this.state.title} description={this.state.description} handleBack={(e: number) =>  this.onDialogClose(e)}
                             open={this.state.open} buttons={this.state.dialogButtons}
                />
            <Header categories={this.state.quizData.map(e => e.categoryId)} className="h-15-vh" currentCategoryIndex={this.state.currentCategoryIndex}
                    outputCurrentIndex={(e: number) => this.setState({currentCategoryIndex: e, currentQuestionIndex: 0})}
                    finalSubmit={(e: boolean) => this.finalSubmit(e)} sendImageList={e => this.saveImageList(e)}
                    finalSubmitOnTimeOut={() => this.onDialogClose(DialogButtonType.yes)}
            />
            <div className="flex flex-row h-75-vh">
                <LeftSidebar className={styles.maxWidth340}  questions={this.state.quizData.length > this.state.currentCategoryIndex &&
                this.state.quizData[this.state.currentCategoryIndex].questions ? this.state.quizData[this.state.currentCategoryIndex].questions : []}
                             currentIndex={this.state.currentQuestionIndex}
                             handleSidebarButton={(event: number) => this.setSidebarState(event)}
                             answeredData={this.state.answersData}
                />
                <Question pageChangeTimer={this.state.pageChangeTimer} categoryId={this.state.quizData[this.state.currentCategoryIndex]?.categoryId}
                          questions={this.state.quizData.length > this.state.currentCategoryIndex &&
                          this.state.quizData[this.state.currentCategoryIndex].questions
                && this.state.quizData[this.state.currentCategoryIndex].questions.length > this.state.currentQuestionIndex
                    ? this.getCurrentQuestion() : {} as IQuestions}
                sendAnswer={(e: number) => this.setOptionAnswer(e)}
                          currentAnswer={this.state.answersData.find(e => e.questionId === this.getCurrentQuestion()?.id)?.optionId || -1}
                          currentIndex={this.state.currentQuestionIndex}
                />
            </div>

                <Footer className="h-10-vh"
                         handleBack={this.handleBackButton.bind(this)}
                        handleClick={this.handleUpdate.bind(this)}
                />
        </div>
        )
    }
}

const ExaminationWrapper = () => {
    return <Examination app={new AppService()} router={useRouter()}/>
}
export default ExaminationWrapper;
