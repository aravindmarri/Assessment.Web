import { AppProps } from 'next/app';
import {NextRouter, useRouter } from 'next/router'
import React from 'react';
import { routerPathKey } from '../../core/keys/router-path.key';
import { storageKey } from '../../core/keys/storage.key';
import { AppService } from '../../services/app.service';
import { PersonalInformationService } from '../../services/personal-information.service';
interface IProps {
    router: NextRouter;
    app: AppService;
}
class LinkCode extends React.Component<IProps, {}>{
    private readonly personalInfoService = new PersonalInformationService();
    constructor(props: IProps) {
        super(props);
        this.props.app.showSpinner();
        setTimeout(() => {
            localStorage.clear();
            const {linkcode} = this.props.router.query;
            linkcode && typeof linkcode === 'string' && linkcode.length > 0 ?
                this.checkLinkCode(linkcode) :
                this.toDenied();
        }, 100);

    }
        render() {
        return <div>   </div>
    }
    checkLinkCode(linkCode: string) {
        this.personalInfoService.verifyLinkCode(linkCode).then(res => {
            this.props.app.showSpinner(false);
            if(res && res.data) {
                localStorage.setItem(storageKey.examineeDetails, JSON.stringify({linkCode, email: res.data}));
                this.props.router.push(routerPathKey.personalInfo);
            } else {
                this.toDenied();
            }
        }).catch(() => {
            this.toDenied();
        })
    }
    toDenied = () => {
        this.props.app.showSpinner(false);
        this.props.router.push(routerPathKey.denied);
    }
}



const LinkCodeWrapper = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();
    return <LinkCode router={router} app={new AppService()}/>
}
export default LinkCodeWrapper;
