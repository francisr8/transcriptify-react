import React, {useState, useCallback, useEffect} from 'react';
import Room from './Room';
import {
    Button,
    Input,
    Modal,
    ListGroup,
    ListGroupItem,
    Alert,
    Row,
    Card,
    Col,
    CardText,
    CardTitle,
    CardBody
} from "reactstrap";
import {useHistory} from "react-router-dom";

const VideoChat = () => {
    const getAllRooms = async () => {

        let solution = await fetch('http://localhost:4000/api/twilio/getRooms').then(res => res.json());
        console.log(solution.rooms)
        setRooms(solution.rooms);
        return solution

    }
    useEffect(() => {
        getAllRooms();
    }, []);
    const [visible, setVisible] = useState(false);
    const [alertColor, setColor] = useState("danger");
    const [alertText, setText] = useState("Please upload a file!");
    const onDismiss = () => setVisible(false);
    const setAlertColor = (color) => setColor(color);
    const setAlertText = (text) => setText(text);

    const [getRooms, setRooms] = useState([]);
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState('');
    const [token, setToken] = useState(null);
    const [modelVisible, setModalVisible] = useState(false);
    const handleUsernameChange = useCallback(event => {
        setUsername(event.target.value);
    }, []);
    const history = useHistory();
    const handleRoomNameChange = useCallback(event => {
        setRoomName(event.target.value);
    }, []);
    const routeChange = () => {
        let path = "/video/history";
        history.push(path);
    }
    const showAlert = (text, color) => {
        console.log("ALERT")
        setAlertColor(color);
        setAlertText(text);
        setVisible(true);
    };

    const handleSubmit = useCallback(
        async event => {
            if (username === '') {

                showAlert("Please fill in a username!", "danger");


            } else {
                console.log(username);
                console.log(roomName);
                const data = await fetch('http://localhost:4000/api/twilio/token', {
                    method: 'POST',
                    body: JSON.stringify({
                        identity: username,
                        room: roomName
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json());
                console.log(data.token)
                setToken(data.token);
                setModalVisible(false);
            }
        },
        [roomName, username]
    );

    const handleLogout = useCallback(event => {
        setToken(null);
    }, []);

    const setActive = (element) => {


        const room = document.getElementById("inputRoom");
        const bGroup = document.getElementById(element);

        console.log(bGroup.classList)
        if(bGroup.classList.contains("btn-primary")) {
            bGroup.classList.remove("btn-primary");
            bGroup.classList.remove("btn");
            bGroup.setAttribute('class', 'list-group-item');
            room.style.visibility = "visible";
            setRoomName("")
        } else {
            room.style.visibility = "hidden";
            bGroup.setAttribute('class', 'btn btn-primary');
        }
    };

    const setModelVisible = () => {
        setModalVisible(true)
    }

    const renderTableData = () => {


        if (getRooms.length === 0) {
            return (
                <> </>
            )
        } else {

            return getRooms.map((value, index) => {
                console.log(value)
                return (

                    <ListGroupItem onClick={(event) => {
                        setActive(value.sid);
                        setRoomName(value.uniqueName);
                    }} tag="a" href="#" id={value.sid} key={value.sid}>{value.uniqueName}</ListGroupItem>
                )
            })

        }

    }

    let render;
    if (token) {
        render = (
            <Room roomName={roomName} token={token} handleLogout={handleLogout} setModalVisible={setModalVisible}/>
        );
    } else {
        render = (
            <>
                <Alert
                    color={alertColor}
                    isOpen={visible}
                    toggle={onDismiss}
                    className="topAlert"
                >
                    {alertText}
                </Alert>
                <Row>
                    <Col sm="6">
                        <Card body outline color="primary">
                            <CardTitle>Create / Join a videomeeting</CardTitle>
                            <CardText>We allow our users to use our brand new videoconference!
                                <br/><br/>
                                At the end of the call you can create a transcription that will make sure you have a
                                clean resume of everything that has been said and who said it.</CardText>
                            <Button color="primary" type="button" onClick={setModelVisible}>Let's call!</Button>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card body outline color="primary">
                            <CardTitle>Check history</CardTitle>
                            <CardText>After each videocall, there is made a transcript so people can check who, when and
                                what they said. <br/> <br/> <br/></CardText>
                            <Button color="primary" type="button" onClick={routeChange}>Show history!</Button>
                        </Card>
                    </Col>
                </Row>
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


                        <label className="label" htmlFor="customRadio5">
                            Create room
                        </label>


                        <Input
                            id="exampleFormControlInput1"
                            placeholder="Username"
                            type="email"
                            onChange={handleUsernameChange}
                        />
                        <br/>
                        <Input
                            id="inputRoom"
                            placeholder="Roomname"
                            type="email"
                            onChange={handleRoomNameChange}
                        />
                        <br/>
                        <p className="centerAlign">--</p>


                        <ListGroup className="listgroup">
                            <p>Join room</p>
                            {renderTableData()}


                        </ListGroup>
                    </div>

                    <div className="modal-footer">
                        <Button
                            color="secondary"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => {
                                setModalVisible(false);
                            }}
                        >
                            Close
                        </Button>
                        <Button color="primary" type="button" onClick={(event) => {
                            handleSubmit();
                        }}>
                            Proceed
                        </Button>
                    </div>
                </Modal>
            </>
        );
    }
    return render;
};

export default VideoChat;