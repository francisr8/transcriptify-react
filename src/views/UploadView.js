import React from "react";

import { Card } from "reactstrap";
import FileUpload from "../components/FileUpload.js";

class UploadView extends React.Component {
  render() {
    return (
      <Card className="mainCard">
        <FileUpload></FileUpload>
      </Card>
    );
  }
}

export default UploadView;
