

export interface IQuestionCategory  {
    categoryId: string;
    questions: IQuestions[];
}
export interface IQuestions  {
    id: number;
    description: string;
    qTypeId: QType;
    option: IOption[];
}

export interface IOption {
    optionId: number;
    description: string;
}

export interface IAnswerData {
    questionId: number;
    optionId: number;
}

export interface SubmitExamPayload {
    LinkCode: string;
    Images: string[];
    QuestionAnswerViews: QuestionAnswerView[];

}
export interface QuestionAnswerView {
    QuestionId: number;
    QTypeId: QType;
    AnswerId: number;
    AnswerText: string;
}

export enum QType{
    Single = 1,
    Multiple,
    Text
}
