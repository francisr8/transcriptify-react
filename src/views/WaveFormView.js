import React from "react";

import { Card } from "reactstrap";
import Waveform from "../components/Waveform/Waveform";

class WaveFormView extends React.Component {
    render() {
        return <Card className="mainCard"><Waveform/></Card>;

    }
}

export default WaveFormView;
