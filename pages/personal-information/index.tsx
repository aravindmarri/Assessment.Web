import {FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { AppProps } from 'next/app';
import {NextRouter, useRouter } from 'next/router';
import React from 'react';
import { routerPathKey } from '../../core/keys/router-path.key';
import { storageKey } from '../../core/keys/storage.key';
import { LinkCodeModel } from '../../core/models/link-code.model';
import { AppService } from '../../services/app.service';
import { PersonalInformationService } from '../../services/personal-information.service';
interface PersonalInfoState {
    initialFormValue: PersonalInfoForm;
    formValues: PersonalInfoForm;
    formErrors: PersonalInfoForm;
    isSubmit: boolean;
    selectedDate: Date | null;
    email: string;
}
class PersonalInfoForm {
    firstName =  '';
    lastName = '';
    phoneNumber: string | number = '';
    aadharNumber: string | number = '';
    collegeName = '';
    previousCompany = '';
    percentage: string | number = '';
    experience: string | number = '';

}
export interface PersonalInfoPayload{
    linkCode: string;
    name: string;
    logTime: string;
    aadhar: number;
    email: string;
    mobile: number;
    fresher: boolean;
    college: string;
    percentage: number;
    previousCompany: string;
    experience: number;
}
export interface IProps {
    router: NextRouter;
    app: AppService;
}

class PersonalInformation extends React.Component<IProps, PersonalInfoState> {
    private readonly personalInfoService = new PersonalInformationService();
    private examineeDetails: LinkCodeModel | null = null;
    constructor(props: IProps) {
        super(props);
        this.state = {
            initialFormValue: new PersonalInfoForm(),
            formValues: new PersonalInfoForm(),
            formErrors: new PersonalInfoForm(),
            isSubmit: false,
            selectedDate: null,
            email: ''
        }
        setTimeout(() => {
            const examineeDetails = localStorage.getItem(storageKey.examineeDetails);
            this.examineeDetails = examineeDetails ? JSON.parse(examineeDetails) : null;
            this.setState({email: this.examineeDetails?.email || ''})
        },100);
    }


     handleChange = (e: any) => {
        const {name,value} = e.target;
        const formValues = this.state.formValues as any;
        formValues[name] = value;
        this.setState({formValues});

    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        if(this.examineeDetails) {
            this.setState({formErrors: this.validation(this.state.formValues)});
            setTimeout(() => {
                if(Object.values(this.state.formErrors).filter(e => e.length > 0 ).length === 0) {
                    this.props.app.showSpinner();
                    this.setState({isSubmit: true});
                    const payload = {} as PersonalInfoPayload;
                    payload.linkCode = this.examineeDetails?.linkCode || '';
                    payload.name = this.state.formValues.firstName + ' ' + this.state.formValues.lastName;
                    payload.logTime = new Date().toISOString();
                    payload.aadhar = Number(this.state.formValues.aadharNumber);
                    payload.email= this.examineeDetails?.email || '';
                    payload.mobile = Number(this.state.formValues.phoneNumber);
                    payload.fresher = Number(this.state.formValues.experience) === 0;
                    payload.college = this.state.formValues.collegeName;
                    payload.percentage = Number(this.state.formValues.percentage);
                    payload.previousCompany = this.state.formValues.previousCompany;
                    payload.experience = Math.abs(Number(this.state.formValues.experience));
                    this.personalInfoService.submitPersonalInfo(payload).then(res => {
                        this.props.app.showSpinner(false);
                        if(res && res.data) {
                            localStorage.setItem(storageKey.questions, JSON.stringify(res.data));
                            this.props.router.push(routerPathKey.cameraCheck);
                        }
                    }).catch(error => {
                        this.props.app.showSpinner(false);
                    });

                }
            });
        }
        else{
            this.props.router.push(routerPathKey.denied);
        }

    }


validation = (values: PersonalInfoForm) => {
    const errors = new PersonalInfoForm();
    if (!values.firstName) {
        errors.firstName = 'Firstname is requried!'
    }
    if (!values.lastName) {
        errors.lastName = 'Lastname is requried!'
    }
    if (!values.phoneNumber) {
        errors.phoneNumber = 'Phone Number is requried!'
    }
    if (isNaN(Number(values.phoneNumber))) {
        errors.phoneNumber = 'Phone Number is invalid!'
    }
    if (!values.aadharNumber) {
        errors.aadharNumber = 'Aadhar is requried!'
    }
    if (isNaN(Number(values.aadharNumber))) {
        errors.aadharNumber = 'Aadhar is invalid!'
    }
    if (!values.collegeName) {
        errors.collegeName = 'College name is requried!'
    }
    if (!values.percentage) {
        errors.percentage = 'Percentage is requried!'
    }
    if (isNaN(Number(values.percentage))) {
        errors.percentage = 'Percentage is invalid!'
    }
    if (!values.experience) {
        errors.experience = 'Experience is requried!'
    }
    if (isNaN(Number(values.experience))) {
        errors.experience = 'Experience is invalid!'
    }
    return errors;
}
    render() {
        return (<div className='max-w-4xl bg-gray rounded-lg shadow mx-auto my-10'>
                <div className="p-4 w-full rounded-t-lg  bg-sky-50 border border-gray-200 dark-bg">
                    <div className='grid'>
                        <h1  className='text-3xl font-bold px-6 text-white'>Personal Information</h1>
                    </div>
                </div>
                <div className='p-5'>
                    <form  onSubmit={this.handleSubmit}>
                        <div className="grid gap-6 mb-6 mt-5 md:grid-cols-2">
                            <div>
                                <label  className="block mb-2 text-sm font-medium">First name</label>
                                <input type="text" id="last_name" name='firstName'
                                       className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500
            focus:border-blue-500 block w-full p-2.5 dark-bg dark:placeholder-gray-400
            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       onChange={this.handleChange}
                                       value={this.state.formValues.firstName}
                                       required
                                       />
                                <p className='text-red-600'>{this.state.formErrors.firstName}</p>
                            </div>
                            <div>
                                <label  className="block mb-2 text-sm font-medium">Last name</label>
                                <input type="text" id="last_name"
                                       className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500
            focus:border-blue-500 block w-full p-2.5 dark-bg dark:placeholder-gray-400
            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  name="lastName"
                                       onChange={this.handleChange}
                                       value={this.state.formValues.lastName}
                                       required
                                       />
                                <p className='text-red-600'>{this.state.formErrors.lastName}</p>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium">Phone number</label>
                                <input type="tel" id="phone"
                                       className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500
            focus:border-blue-500 block w-full p-2.5 dark-bg dark:placeholder-gray-400
            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern='[0-9]{10}' name='phoneNumber'
                                       onChange={this.handleChange}
                                       value={this.state.formValues.phoneNumber}
                                       required
                                       />
                                <p className='text-red-600'>{this.state.formErrors.phoneNumber}</p>

                            </div>
                            <div>
                                <label  className="block mb-2 text-sm font-medium">Aadhar Number</label>
                                <input type="tel" id=""
                                pattern='[0-9]{12}'
                                       className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500
            focus:border-blue-500 block w-full p-2.5 dark-bg dark:placeholder-gray-400
            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name='aadharNumber'
                                       onChange={this.handleChange}
                                       value={this.state.formValues.aadharNumber}
                                       required
                                       />
                                <p className='text-red-600'>{this.state.formErrors.aadharNumber}</p>

                            </div>

                        </div>
                        <div className="mb-6">
                            <label  className="block mb-2 text-sm font-medium">Email address</label>
                            <input type="email" id="email"
                                   className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500
            focus:border-blue-500 block w-full p-2.5 dark-bg dark:placeholder-gray-400
            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name='email'
                                   onChange={this.handleChange}
                                   value={this.state.email}
                                   readOnly
                                   />

                        </div>
                        <div className="mb-6">
                            <label  className="block mb-2 text-sm font-medium">College Name</label>
                            <input type="text" id="college"
                                   className="bg-gray-50 border border-gray-300 text-sm rounded-lg
        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark-bg
        dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name='collegeName'
                                   onChange={this.handleChange}
                                   value={this.state.formValues.collegeName}
                                   required
                                   />
                            <p className='text-red-600'>{this.state.formErrors.collegeName}</p>

                        </div>
                        <div className="mb-6">
                            <label  className="block mb-2 text-sm font-medium">Previous company</label>
                            <input type="text" id="confirm_password"
                                   className="bg-gray-50 border border-gray-300 text-sm rounded-lg
        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark-bg
        dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name='previousCompany'
                                   onChange={this.handleChange}
                                   value={this.state.formValues.previousCompany}
                                   />
                            <p className='text-red-600'>{this.state.formErrors.previousCompany}</p>

                        </div>
                        <div className="flex flex-wrap">
                            <div className="w-full md:w-1/2 pr-3 mb-6 md:mb-0">
                                <label className="block mb-2 text-sm font-medium" >
                                    Percentage (in %)
                                </label>
                                <input className="appearance-none block w-full bg-gray-50 dark-bg border
                                border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white
                                 focus:border-gray-500" id="grid-city" type="number"
                                       onChange={this.handleChange}
                                       name="percentage"
                                       value={this.state.formValues.percentage}
                                       required/>
                                <p className='text-red-600'>{this.state.formErrors.percentage}</p>
                            </div>

                            <div className="w-full md:w-1/2 pl-3 mb-6 md:mb-0">
                                <label className="block mb-2 text-sm font-medium"
                                >
                                    Experience (in years) - Enter 0, if fresher.
                                </label>
                                <input className="appearance-none block w-full bg-gray-50 dark-bg border
                                 border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white
                                  focus:border-gray-500" id="grid-city" type="text"
                                       onChange={this.handleChange}
                                       name="experience"
                                       value={this.state.formValues.experience}
                                       required/>
                                <p className='text-red-600'>{this.state.formErrors.experience}</p>
                            </div>

                        </div>

                        <div className='flex justify-center space-x-5 m-3'>
                            <button className='w-32 light200-bg px-5 mt-6 p-2 font-medium text-sm rounded-full'>Submit</button>
                        </div></form>
                </div>

            </div>

        )
    }
}
const PersonalInformationWrapper = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();
    return (
        <PersonalInformation router={router} app={new AppService()}/>
    )
}
export default PersonalInformationWrapper;
