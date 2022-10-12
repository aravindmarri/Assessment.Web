import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import  styles from '../../../styles/popup.module.scss';

import DialogTitle from '@mui/material/DialogTitle';

export interface DialogModel {
    open: boolean;
    title: string;
    description: string
}
interface  IState {
    open:boolean;

}
export interface DialogButton {
    name: string;
    type: DialogButtonType;
}

export enum DialogButtonType{
    yes = 1, no
}

interface  IProps {
    title:string;
    description:string;
    handleBack:any;
    open:boolean;
    buttons: DialogButton[];
}
class AlertDialog extends React.Component<IProps,IState> {

    constructor(props:any) {
        super(props);

    };
render()
        {
            const { title,description,open}= this.props;

            const createDescriptionMarkup = (data: string) => {
                return { __html: data };
            }
            return (
                    <Dialog

                        open={open}


                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        PaperProps= {{ sx: {
                          maxWidth:'300px',
                              minHeight:'200px',
                                borderRadius:'30px',
                                padding: '16px 16px 24px'
                          }} } >
                        <DialogTitle id="alert-dialog-title" textAlign="center" className={styles.dialogTitle}>
                            <span className="text-center" dangerouslySetInnerHTML={createDescriptionMarkup(title)}></span>
                        </DialogTitle>
                        <DialogContentText textAlign="center" className={'test-sm font-medium ' + styles.dialogDesc}>
                            <span className="text-center" dangerouslySetInnerHTML={createDescriptionMarkup(description)}></span>
                        </DialogContentText>
                        <DialogActions className="mt-8">
                            {
                                this.props.buttons?.map((item, i) => {
                                return  <Button key={i + 1} onClick={(e) => this.props.handleBack(item.type)}
                                                className={'dark-bg ' + styles.buttons}
                                >
                                    {item.name}
                                </Button>
                            })
                               }
                        </DialogActions>
                    </Dialog>
            );
        }
}
    export default AlertDialog
