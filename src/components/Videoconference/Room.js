import React, {useState, useEffect} from 'react';
import Video from 'twilio-video';
import Participant from './Participant';
import {Container, Row, Col, Button} from 'reactstrap';
import ChatBox from "./Chatbox";

const Room = ({roomName, token, handleLogout, setModalVisible}) => {
    const [room, setRoom] = useState(null);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        const participantConnected = participant => {
            setParticipants(prevParticipants => [...prevParticipants, participant]);
        };

        const participantDisconnected = participant => {
            setParticipants(prevParticipants =>
                prevParticipants.filter(p => p !== participant)
            );
        };

        Video.connect(token, {
            name: roomName
        }).then(room => {
            setRoom(room);
            room.on('participantConnected', participantConnected);
            room.on('participantDisconnected', participantDisconnected);
            room.participants.forEach(participantConnected);
        });

        return () => {
            setRoom(currentRoom => {
                if (currentRoom && currentRoom.localParticipant.state === 'connected') {
                    currentRoom.localParticipant.tracks.forEach(function (trackPublication) {
                        trackPublication.track.stop();
                    });
                    currentRoom.disconnect();
                    return null;
                } else {
                    return currentRoom;
                }
            });
        };
    }, [roomName, token]);

    const remoteParticipants = participants.map(participant => (
        <Col xs="3"><Participant key={participant.sid} participant={participant} head={false}/></Col>
    ));

    return (
        <Container>
            <Row>
                <Col></Col>
                <Col> <h2 className="headerRoom">Room: {roomName}</h2></Col>
                <Col> <Button color="primary" className="logoutBtn" size="sm" onClick={(event) => { handleLogout(); setModalVisible(true); }}>Log out</Button></Col>

            </Row>

            <Row className="mainRow">
                <Col>
                    <div className="room">

                        <div className="local-participant">
                            {room ? (
                                <>
                                    <Participant
                                        key={room.localParticipant.sid}
                                        participant={room.localParticipant}
                                    />
                                </>
                            ) : (
                                ''
                            )}
                        </div>
                        <h3>Remote Participants</h3>
                        <Container>
                            <div className="remote-participants"><Row> {remoteParticipants} </Row></div>
                        </Container>

                    </div>
                </Col>
                <Col>
                    <ChatBox></ChatBox>
                </Col>
            </Row>
        </Container>

    );
};

export default Room;