import React from "react";

import { Card } from "reactstrap";
import History from "../components/History/History";

class HistoryView extends React.Component {
    render() {
        return (
            <Card className="mainCard">
              <History></History>
            </Card>
        );
    }
}

export default HistoryView;
