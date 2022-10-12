import React from 'react';
import * as faceapi from 'face-api.js';
import { DrawFaceLandmarks } from 'face-api.js/build/commonjs/draw';
import {NextRouter, useRouter } from 'next/router';
import { AppProps } from 'next/app';
import { Button } from '@mui/material';
import AlertDialog, {DialogButtonType, DialogModel } from '../../core/shared-components/dialog';
import { AppService } from '../../services/app.service';
import { routerPathKey } from '../../core/keys/router-path.key';

declare let navigator: any;
interface IProps {
    router: NextRouter
}
interface IState extends DialogModel{
    cameraError: boolean;
}
class CameraCheck extends React.Component<IProps, IState> {
    private readonly violationMaximumDuration = 5; // in seconds
    private readonly faceDetectionIntervalTime = 100; // in milliseconds
    //Life Cycle Hooks
    private video: HTMLVideoElement | undefined;
    private intervalWatch: NodeJS.Timer | undefined;
    constructor(props: IProps) {
        super(props);
        this.state = {
            cameraError: true,
            open: false,
            title: '',
            description: ''
        }
    }
    componentDidMount() {
        setTimeout(() =>  {
            this.checkCameraAndMicPermissions()
        });
    }
    componentWillUnmount() {
        clearInterval(this.intervalWatch);
        this.startFaceDetectionListener(false);
    }


    //Functions
    checkCameraAndMicPermissions(){
        if (typeof window !== "undefined") {

            if (faceapi) {
                Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/Face API Models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/Face API Models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/Face API Models'),
                    faceapi.nets.faceExpressionNet.loadFromUri('/Face API Models')
                ]).then(() => this.startVideo());
            }
        }
    }

    startVideo = () => {
        navigator.getUserMedia({video: {}}, (stream: any) => {
            this.video = document.getElementById('videoElem') as HTMLVideoElement;
            if(this.video){
               this.setState({cameraError: false});
                this.video.srcObject = stream;
                this.startFaceDetectionListener();
            }
        }, (err: any) => {
            console.log(err);
            this.setState({open: true, title: 'Enable camera!', description: 'You have to enable camera and refresh the page to proceed further.'});
        });
    }

    startFaceDetectionListener(listen = true) {
        if(this.video) {

            const interval = (canvas: HTMLCanvasElement, displaySize: { width: number, height: number }) => {
                this.intervalWatch = setInterval(async () => {
                    if (this.video) {
                        const detections = await faceapi.detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions({
                            inputSize: 224,
                            scoreThreshold: 0.6
                        })).withFaceLandmarks().withFaceExpressions()
                        const rect = canvas.getContext('2d');
                        if (rect) {
                            rect.clearRect(0, 0, canvas.width, canvas.height);
                        }
                            if (displaySize.width > 0 && displaySize.height > 0) {
                                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                            }

                    }
                }, this.faceDetectionIntervalTime);
            };
            const listener = () => {
                const videoParent = document.getElementById('videoParentElem');
                if (this.video) {
                    const canvas = faceapi.createCanvasFromMedia(this.video);
                    if (videoParent) {
                        videoParent.append(canvas);
                        const displaySize = {width: this.video.width, height: this.video.height};
                        canvas.style.width = displaySize.width + 'px';
                        canvas.style.height = (displaySize.height - 10) + 'px';
                        canvas.style.position = 'absolute';
                        faceapi.matchDimensions(canvas, displaySize)
                        interval(canvas, displaySize);
                    }
                }
            }
            listen?
                this.video.addEventListener('playing', listener, true)
                : this.video.removeEventListener('playing', listener, true);

        }
    }

    render() {
        return <>
            <div className="flex flex-col camera-check-video-view-text-wrapper">
                <AlertDialog title={this.state.title} description={this.state.description} handleBack={() => this.setState({open: false})}
                             open={this.state.open} buttons={[{name: 'Ok', type: DialogButtonType.yes}]}
                /> <span className="text-center text-lg font-medium mt-6">Fix your sitting position</span>
            <span className="text-center my-4 danger-text">
                You will have {this.violationMaximumDuration} violations accepted. </span>
                <span className="text-center mb-4">
                Your examination will be cancelled, if you exceed maximum number of violations.
            </span>
                <span className="font-medium">
                    Exam rules to avoid violations:
                </span>
                <ul className="camera-check-video-view-ul">
                    <li>You should not turn off camera at any point during the exam.</li>
                    <li>Your face should be centered, facing the camera.</li>
                    <li>No faces more than one should be detected by camera.</li>
                    <li>You should not open any other window apart from exam window.</li>
                </ul>
            </div>
            <div className="flex flex-col camera-check-video-view-wrapper sm:flex-row">
            <div className="relative camera-check-video-view flex justify-center" id="videoParentElem">
                <video height={400} width={540} id="videoElem" controls={false} autoPlay>
                </video>
            </div>
                <div className="flex items-center justify-center w-auto my-4">
                    <Button className="primary-button dark-bg" variant="contained" disabled={this.state.cameraError} onClick={this.proceed} disableElevation>Proceed {'>'}</Button>
                </div>
            </div>
        </>
    }

    proceed = () => {
        this.props.router.push(routerPathKey.examination);
    }
}

const CameraCheckWrapper = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();
    return (
        <CameraCheck router={router} />
    )
}
export default CameraCheckWrapper;
