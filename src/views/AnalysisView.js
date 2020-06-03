import React from "react";

import { Card } from "reactstrap";
import AnalysisForm from '../components/Analysis/AnalysisForm';

class AnalysisView extends React.Component {
    render() {
        return (
            <Card className="mainCard">
                <AnalysisForm />
            </Card>
        );
    }
}

export default AnalysisView;
