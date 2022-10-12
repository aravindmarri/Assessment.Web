import React from "react";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import  styles from '../../styles/Home.module.css';
import { pink } from "@mui/material/colors";


export interface IProps {

}
class Successful extends React.Component<IProps, {}>{

    render() {
        return (
            <div className='w-screen h-screen  flex justify-center items-center py-8'>
                <div className='w-96 h-60  p-4  text-center' >
                   <CheckCircleIcon  className={styles.success}   />

                    <h1 className='py-4 text-4xl font-medium' >Thank You!</h1>
                      <p>Your examination has been submitted.</p>
                </div>

            </div>
        )
    }

}
export default Successful;

