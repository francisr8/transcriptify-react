import React, { useState, useEffect } from "react";
import { Input, Alert, Button, Row, Col } from 'reactstrap';
import AnalysisTable from './AnalysisTable.js';
import AnalysisGraph from '../Graph/AnalysisGraph.js';
import SpeakerGraph from '../Graph/SpeakerGraph.js';

const AnalysisForm = (props) => {
    const [service, setService] = useState('PyannoteManual');
    const [datasetType, setDatasetType] = useState('default');
    const [analysisData, setAnalysisData] = useState({});
    const [visible, setVisible] = useState(false);
    const [alertColor, setColor] = useState("danger");
    const [alertText, setText] = useState("Please upload a file!");
    const [testData, setTestData] = useState({});

    const onDismiss = () => setVisible(false);
    const setAlertColor = (color) => setColor(color);
    const setAlertText = (text) => setText(text);

    const showAlert = (text, color) => {
        setAlertColor(color);
        setAlertText(text);
        setVisible(true);
    };

    let modelTest = '';
    let dataset = 'default';

    const changeServiceType = async (event) => {
        let serv;
        if (event === undefined) {
            serv = service;
        } else {
            serv = event.target.value
            setService(serv);
        }

        let loader = document.querySelector(".loader");
        let overlay = document.querySelector(".overlay");

        if (serv === 'PyannoteManual' || serv === 'PyannoteAuto') {
            modelTest = serv;
            loader.classList.remove("invisible");
            overlay.classList.remove("invisible");

            await fetch("http://localhost:4000/api/analysis/test/" + serv + '/' + dataset, {
                method: "GET",
            }).then((response) => {
                loader.classList.add("invisible");
                overlay.classList.add("invisible");
                if (response.status === 200 || response.status === 201) {
                    response.json().then((res) => {
                        setAnalysisData(res);
                    });
                } else {
                    console.log(response.status);

                    showAlert("No results available", "danger");
                    loader.classList.add("invisible");
                    overlay.classList.add("invisible");
                    setAnalysisData([]);
                }
            }).catch((err) => {
                loader.classList.add("invisible");
                overlay.classList.add("invisible");

                console.log(err);

                showAlert("Something went wrong", "danger");
            });
        } else if (serv === 'Pyaudio') {
            setAnalysisData([]);
        }
    }

    const changeDatasetType = (event) => {
        if (event === undefined) {
            dataset = datasetType;
        } else {
            dataset = event.target.value
            setDatasetType(dataset);
        }
        changeServiceType();
    }

    const getData = (() => {
        fetch('http://localhost:4000/api/analysis/test_results', {
            method: "GET"
        }).then((response) => {
            if (response.status === 200 || response.status === 201) {
                response.json().then((res) => {
                    setTestData(res);
                });
            }
        })
    })

    const testModel = (() => {
        fetch('http://localhost:4000/api/analysis/generate_test/' + service, {
            method: "GET"
        }).then((response) => {
            if (response.status !== 200 && response.status !== 201) {
                showAlert('Something went wrong', 'danger');
            }
        })
    })

    useEffect(() => {
        changeServiceType();
        getData();
    }, [])

    return (
        <div className='analysisWrapper'>
            <Alert
                color={alertColor}
                isOpen={visible}
                toggle={onDismiss}
                className="topAlert"
            >
                {alertText}
            </Alert>
            <label> Select evaluation: </label>
            <Row>
                <Col md='5'>
                    <Input type="select" name="service" id="serviceSelect" onChange={changeServiceType} value={service}>
                        <option value='PyannoteManual'>PyAnnote Custom Pipeline</option>
                        <option value='PyannoteAuto'>PyAnnote</option>
                        <option value='Pyaudio'>PyAudio</option>
                        <option value='Graph'>Graph</option>
                        <option value='SpeakerGraph'>Speaker Graph</option>
                    </Input>
                </Col>
                <Col md='5'>
                    <Input type="select" name="service" id="datasetSelect" onChange={changeDatasetType} value={datasetType}>
                        <option value='default'>English</option>
                        <option value='cgn_'>Dutch</option>
                    </Input>
                </Col>
                <Col md='2'>
                    {
                        service !== 'Graph' && service !== 'SpeakerGraph' ? <Button color='primary' onClick={() => { testModel(modelTest) }}>Test model</Button> : <></>
                    }
                </Col>
            </Row>

            {
                service === 'SpeakerGraph' ? <SpeakerGraph data={testData} /> :
                    service === 'Graph' ? <AnalysisGraph data={testData} /> : <div id='analysisData'>
                        <AnalysisTable data={analysisData} />
                    </div>
            }

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
        </div >
    )
}

export default AnalysisForm;