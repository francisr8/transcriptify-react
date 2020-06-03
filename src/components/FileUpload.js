import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button, ButtonGroup, Alert, Badge, Modal, Input } from "reactstrap";
import "wavesurfer.js/dist/wavesurfer.js";
import WaveSurfer from "wavesurfer.js/dist/wavesurfer.js";
import "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import RegionsPlugin from "wavesurfer.js/src/plugin/regions";
import { useHistory } from "react-router-dom";

import "../assets/css/loading.scss";

const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12%",
    borderWidth: "0.15rem",
    borderRadius: "1rem",
    borderColor: "#bbb",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#000",
    outline: "none",
    transition: "border .24s ease-in-out",
};

const activeStyle = {
    borderColor: "#2196f3",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};

const FileUpload = (props) => {
    const waveformRef = useRef();
    let history = useHistory();
    const [speakers, setSpeakers] = useState(0);
    const [service, setService] = useState("Google");
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: "audio/*",
        onDrop: (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
            const wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: "#5e72e4",
                progressColor: "#5e72e4",
                cursorWidth: 0,
                height: 100,
                interact: false,
                plugins: [
                    RegionsPlugin.create({
                        deferInit: true,
                    }),
                ],
            });
            wavesurfer.load(acceptedFiles[0].preview);
        },
    });
    const removeAll = () => {
        setFiles([]);
    };

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isDragActive, isDragAccept, isDragReject]
    );

    const [files, setFiles] = useState([]);

    const uploadFile = () => {
        let loader = document.querySelector(".loader");
        let overlay = document.querySelector(".overlay");
        loader.classList.remove("invisible");
        overlay.classList.remove("invisible");
        if (files.length === 0) {
            // TODO: Alert
            showAlert("Please upload a file!", "danger");
            loader.classList.add("invisible");
            overlay.classList.add("invisible");
        } else {
            let file = files[0];
            let formData = new FormData();
            formData.append("file", file);
            formData.append("speakers", speakers);
            formData.append("service", service);

            fetch("http://localhost:4000/api/files/upload", {
                method: "POST",
                body: formData,
                headers: new Headers({
                    enctype: "multipart/form-data",
                }),
            }).then((response) => {
                loader.classList.add("invisible");
                overlay.classList.add("invisible");
                if (response.status === 200 || response.status === 201) {
                    response.json().then((res) => {
                        console.log(res);

                        showAlert(
                            "Successfully uploaded file to id: " + res.message,
                            "success"
                        );
                        history.push({
                            pathname: "/main/waveform/",
                            state: {
                                id: res.message,
                                regions: res.regions,
                                transcript: res.transcript,
                                transcriptId: res.transcriptId,
                                pdfId: res.pdfkey,
                                service: service,
                                sad_scores: res.sad_scores,
                                scd_scores: res.scd_scores,
                            },
                        });
                    });
                } else {
                    showAlert("Something went wrong", "danger");
                }
            });
        }
    };

    const prevs = files.map((file) => (
        <div key={file.name}>
            <Badge color="default">{file.name}</Badge>
            <div ref={waveformRef}></div>
        </div>
    ));
    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memoryx leaks
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        },
        [files]
    );
    const [modelVisible, setModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [alertColor, setColor] = useState("danger");
    const [alertText, setText] = useState("Please upload a file!");

    const onDismiss = () => setVisible(false);
    const setAlertColor = (color) => setColor(color);
    const setAlertText = (text) => setText(text);

    const showAlert = (text, color) => {
        setAlertColor(color);
        setAlertText(text);
        setVisible(true);
    };
    const setSpeakerCount = (event) => {
        setSpeakers(event.target.value);
    }
    const setServiceType = (event) => {
        setService(event.target.value);
    }
    return (
        <div className="container">


            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>

            <ButtonGroup className="uploadBtnGroup">

                <Button
                    color="primary"
                    size="lg"
                    type="button"
                    className="uploadBtn"
                    onClick={() => {
                        setModalVisible(true)
                    }}
                    data-toggle="modal"
                    data-target="#exampleModal"
                >
                    Generate transcript
                </Button>
                <Button
                    color="danger"
                    size="lg"
                    type="button"
                    className="uploadBtn"
                    onClick={removeAll}
                >
                    Remove files
                </Button>
            </ButtonGroup>

            <div className="waveform-preview">{prevs}</div>

            <Modal
                className="modal-dialog-centered"
                isOpen={modelVisible}
                toggle={() => setModalVisible(false)}
            >
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                        Settings
                    </h5>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setModalVisible(false)}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <label>Number of speakers: </label>
                    <Input type="select" name="select" id="exampleSelect" onChange={setSpeakerCount}>
                        <option value='0'>Auto</option>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                    </Input>
                    <br />
                    <label>Type of service: </label>
                    <Input type="select" name="select" id="exampleSelect" onChange={setServiceType}>
                        <option value='Google'>Google API</option>
                        <option value='Pyannote'>PyAnnote</option>
                        <option value='PyannoteManual'>PyAnnote Custom Pipeline</option>
                        <option value='Pyaudio'>PyAudio</option>
                    </Input>
                </div>
                <div className="modal-footer">
                    <Button
                        color="secondary"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setModalVisible(false)}
                    >
                        Close
                    </Button>
                    <Button color="primary" type="button" onClick={(event) => { setModalVisible(false); uploadFile(); }}>
                        Proceed
                    </Button>
                </div>
            </Modal>
            <Alert
                color={alertColor}
                isOpen={visible}
                toggle={onDismiss}
                className="topAlert"
            >
                {alertText}
            </Alert>

            <div className="overlay invisible"></div>

            <div className="loader invisible">
                <div>
                    <ul>
                        <li>
                            <svg viewBox="0 0 90 120" fill="currentColor">
                                <path
                                    d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                            </svg>
                        </li>
                        <li>
                            <svg viewBox="0 0 90 120" fill="currentColor">
                                <path
                                    d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                            </svg>
                        </li>
                        <li>
                            <svg viewBox="0 0 90 120" fill="currentColor">
                                <path
                                    d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                            </svg>
                        </li>
                        <li>
                            <svg viewBox="0 0 90 120" fill="currentColor">
                                <path
                                    d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                            </svg>
                        </li>
                        <li>
                            <svg viewBox="0 0 90 120" fill="currentColor">
                                <path
                                    d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                            </svg>
                        </li>
                        <li>
                            <svg viewBox="0 0 90 120" fill="currentColor">
                                <path
                                    d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                            </svg>
                        </li>
                    </ul>
                </div>
                <h1>Loading</h1>
            </div>
        </div>


    );
};

export default FileUpload;
