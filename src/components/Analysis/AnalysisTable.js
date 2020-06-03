import React from "react";
// reactstrap components
import {
    Table,
} from "reactstrap";

class AnalysisTable extends React.Component {
    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    renderTableData() {
        let data = this.props.data;
        if (this.isEmpty(data)) {
            return (<></>);
        } else {
            return data.map((d, index) => {
                const { type, DER, Precision, Recall, Coverage, Purity } = d;
                return (
                    <tr key={type}>
                        <td>{type.toUpperCase().replace('_', " ")}</td>
                        <td>{parseFloat(DER * 100).toFixed(2)}%</td>
                        <td>{parseFloat(Precision * 100).toFixed(2)}%</td>
                        <td>{parseFloat(Recall * 100).toFixed(2)}%</td>
                        <td>{parseFloat(Coverage * 100).toFixed(2)}%</td>
                        <td>{parseFloat(Purity * 100).toFixed(2)}%</td>
                    </tr>
                )
            });
        }
    }

    render() {
        return (
            <>
                <Table className="align-items-center" responsive>
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Type of test</th>
                            <th scope="col">DER</th>
                            <th scope="col">Precision</th>
                            <th scope="col">Recall</th>
                            <th scope="col">Coverage</th>
                            <th scope="col">Purity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTableData()}
                    </tbody>
                </Table>
            </>
        );
    }
}

export default AnalysisTable