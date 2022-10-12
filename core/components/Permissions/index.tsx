import React, { Dispatch } from 'react';
import * as faceapi from 'face-api.js';
import { DrawFaceLandmarks } from 'face-api.js/build/commonjs/draw';
import AlertDialog, { DialogButtonType } from '../../shared-components/dialog';
import { gaKey } from '../../keys/ga.key';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../state/hook';
import { AnyAction } from 'redux';
import * as actionCreators from "../../../state/actions";

declare let navigator: any;
interface IState {
    violationLeft: number;
    open: boolean;
    title: string;
    description: string;
    cancelled: boolean;
}

interface IProps {
    submitExamOnCancel: (e: void) => void;
    sendImageList: (e: string[]) => void;
    dispatch: Dispatch<AnyAction>;
    selector: any;
}
class PermissionsInner extends React.Component<IProps, IState> {
    private readonly violationMaximumDuration = 10; // in seconds
    private readonly faceDetectionIntervalTime = 100; // in milliseconds
    private readonly imageCaptureIntervalTime = 6 * 60; // in seconds
    //Life Cycle Hooks
    private video: HTMLVideoElement | undefined;
    private intervalWatch: NodeJS.Timer | undefined;
    private violationTimeList = new Array<number>();
    private imageList: string[] = [];
    constructor(props: IProps) {
        super(props);
        this.state = { violationLeft: gaKey.totalAllowedViolations, open: false, title: '', description: '', cancelled: false }
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

    static getDerivedStateFromProps(props: IProps, state: IState) {

        const violationLeft = props.selector.violations;
        return { violationLeft: violationLeft < 0 ? 0 : props.selector.violations}
    }

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
                this.video.addEventListener('suspend', (event) => {
                    this.setState({open: true, title: 'Camera detection failed!', description: 'Enable camera permission and refresh the page.'})
                });
                this.video.srcObject = stream;
                this.startFaceDetectionListener();
            }
        }, (err: any) => {
            console.log(err)
        });    }

    startFaceDetectionListener(listen = true) {
        let intervalLoop = 0;
        if(this.video) {
            const generateImage = () => {
                if(this.video) {
                    const imgCanvas = document.createElement("canvas");
                imgCanvas.width = this.video.width;
                imgCanvas.height = this.video.height; const imgRect = imgCanvas.getContext('2d');
                if(imgRect){
                    imgRect.drawImage(this.video, 0, 0, imgCanvas.width, imgCanvas.height);
                    this.imageList.push(imgCanvas.toDataURL());
                    this.props.sendImageList(this.imageList);
                    if(imgCanvas && imgCanvas.parentNode) {
                        imgCanvas.parentNode.removeChild(imgCanvas);
                    }
                }
                }
            }
            const interval = (canvas: HTMLCanvasElement, displaySize: { width: number, height: number }) => {
                this.intervalWatch = setInterval(async () => {
                    if (this.video) {
                        const detections = await faceapi.detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions({
                            inputSize: 224,
                            scoreThreshold: 0.6
                        })).withFaceLandmarks().withFaceExpressions();
                    const rect = canvas.getContext('2d');
                        if (rect) {
                            rect.clearRect(0, 0, canvas.width, canvas.height);
                        }
                        if (detections.length >= 1) {
                            if (displaySize.width > 0 && displaySize.height > 0) {
                                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                            }
                    }
                    if(detections.length !== 1) {
                        this.onMultipleFaceDetection();
                    } else {
                        this.violationTimeList = [];
                    }
                        intervalLoop += 1;
                    if (this.faceDetectionIntervalTime / 1000 * intervalLoop === this.imageCaptureIntervalTime) {
                        generateImage();
                        intervalLoop = 0;
                    }
                    }
                    if(this.state.violationLeft === 0 && !this.state.cancelled) {
                        this.props.submitExamOnCancel();
                        this.setState({cancelled: true});
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
                    canvas.style.height = (displaySize.height + 20) + 'px';
                    canvas.style.position = 'absolute';
                    canvas.style.transform = 'rotateY(180deg)';
                    faceapi.matchDimensions(canvas, displaySize)
                    generateImage();
                    interval(canvas, displaySize);
                }
                }
            }
            listen?
                this.video.addEventListener('playing', listener, true)
            : this.video.removeEventListener('playing', listener, true);

        }
    }

    onMultipleFaceDetection() {
      this.violationTimeList.push(Date.now());
        if((this.violationTimeList.length * this.faceDetectionIntervalTime / 1000) > this.violationMaximumDuration){
            this.props.dispatch(actionCreators.violationCreators.decrementViolation());
            const violationLeft = this.state.violationLeft - 1 < 0 ? 0 : this.state.violationLeft - 1;
            if(violationLeft === 0) {
               if(!this.state.cancelled) {
                   this.props.submitExamOnCancel();
               }
                this.setState({violationLeft, open: true, title: `<span class="danger-text">Examination is cancelled</span>`, description:
                        `You have exceeded maximum number of violations`, cancelled: true});
            } else {
                this.setState({violationLeft, open: true, title: 'Violation is captured by the system!', description:
                        `Your examination will be cancelled after <strong class="danger-text">${violationLeft}</strong> violation ${violationLeft <=1 ? 'attempt' :'attempts'}.<br/>
<strong class="danger-text"> Make sure your face is centred in camera and should only have one face.</strong>`});
            }
            this.violationTimeList = [];
        }
    }

    render() {
        return <>
            <AlertDialog title={this.state.title} description={this.state.description} handleBack={() => this.closeDialog(false)}
                         open={this.state.open} buttons={[{name: 'Ok', type: DialogButtonType.yes}]}/>
            <div className="relative video-view flex justify-center" id="videoParentElem">
            <video height={150} width={280} id="videoElem" controls={false} autoPlay>
            </video>
            <span className="absolute violation-text">Violations left: {this.state.violationLeft}</span>
        </div>
            </>
    }

    closeDialog(arg0: boolean) {
        this.setState({open: false});
    }
}

const Permissions = (props: any) => {
    return <PermissionsInner submitExamOnCancel={(e) => props.submitExamOnCancel(e)} sendImageList={(e) => props.sendImageList(e)}
                             dispatch={useDispatch()} selector={useAppSelector(state => state.violations)} />
};

export default Permissions;
