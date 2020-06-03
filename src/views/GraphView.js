import React from "react";

import { Card } from "reactstrap";
import GeneralWaveForm from "../components/Waveform/GeneralWaveForm";
import SpeechActivationGraph from "../components/Graph/SpeechActivationGraph";
import SpeakerChangeGraph from '../components/Graph/SpeakerChangeGraph';

class GraphView extends React.Component {
    render() {
        return <>
            <Card className="subCard">
                <GeneralWaveForm />
            </Card>
            <Card className="subCard">
                <div className='p2'>
                    <h1>Speech Activation</h1>
                    <div>
                        <SpeechActivationGraph />
                    </div>
                </div>
            </Card>
            <Card className="subCard">
                <div className='p2'>
                    <h1>Speaker Change</h1>
                    <div>
                        <SpeakerChangeGraph />
                    </div>
                </div>
            </Card>
        </>;

    }
}

export default GraphView;
