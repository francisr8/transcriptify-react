import React from "react";

import {Card} from "reactstrap";
import VideoChat from "../components/Videoconference/VideoChat";



class VideoView extends React.Component {
    render() {
        return (
            <Card className="mainCard">
                <div className="videoChatView"><VideoChat></VideoChat></div>

            </Card>
        );
    }
}

export default VideoView;
