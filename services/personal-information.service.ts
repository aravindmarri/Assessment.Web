import axios from "axios";
import { SubmitExamPayload } from "../core/models/question.model";
import { PersonalInfoPayload } from "../pages/personal-information";

export class PersonalInformationService {
    private readonly apiUrl = process.env.NEXT_PUBLIC_API_URL;

    verifyLinkCode = (link: string) => axios.get(`${this.apiUrl}linkcode/${link}`)

    submitPersonalInfo = (payload: PersonalInfoPayload) =>  axios.post(`${this.apiUrl}api/UserProfile`, payload)

    submitExam = (payload: SubmitExamPayload) =>  axios.post(`${this.apiUrl}api/StoreAnswers`, payload)

}
